'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { sendEmail } from '@/lib/email/resend';
import { renderEmail } from '@/lib/email/render';
import { fromAddress } from '@/lib/email/config';
import { createAdminClient } from '@/lib/supabase/admin';

// Devuelve { error } en vez de lanzar: en producción Next oculta el texto de los errores.
export async function replyMessage(formData: FormData): Promise<{ error?: string }> {
  try {
    return await doReply(formData);
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e && String((e as { digest?: string }).digest).startsWith('NEXT_REDIRECT')) throw e;
    return { error: e instanceof Error ? e.message : 'No se pudo enviar la respuesta.' };
  }
}

async function doReply(formData: FormData): Promise<{ error?: string }> {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id'));
  const body = String(formData.get('body') || '').trim();
  if (!body) throw new Error('Escribe una respuesta.');

  const { data: msg } = await supabase.from('email_inbox').select('*').eq('id', id).single();
  if (!msg) throw new Error('Mensaje no encontrado.');

  const subject = msg.subject?.toLowerCase().startsWith('re:') ? msg.subject : `Re: ${msg.subject || 'tu mensaje'}`;
  const { html, text } = renderEmail({ body, recipient: { name: msg.from_name, email: msg.from_email } });
  const headers: Record<string, string> = {};
  if (msg.message_id) {
    headers['In-Reply-To'] = msg.message_id;
    headers['References'] = msg.message_id;
  }

  // Adjuntos: ya están en el bucket privado; Resend los descarga con un enlace temporal
  let files: { path: string; filename: string }[] = [];
  try {
    const raw = JSON.parse(String(formData.get('attachments') || '[]'));
    if (Array.isArray(raw)) files = raw.filter(f => typeof f?.path === 'string' && f.path.startsWith(`replies/${id}/`)).slice(0, 10);
  } catch { /* sin adjuntos */ }
  const attachments: { filename: string; path: string }[] = [];
  if (files.length) {
    const admin = createAdminClient();
    for (const f of files) {
      const { data, error } = await admin.storage.from('email-attachments').createSignedUrl(f.path, 60 * 60);
      if (error || !data) throw new Error(`No se pudo preparar el adjunto ${f.filename}.`);
      attachments.push({ filename: String(f.filename).slice(0, 120), path: data.signedUrl });
    }
  }

  await sendEmail({ to: msg.from_email, subject, html, text, reply_to: fromAddress(), headers, attachments });

  await supabase.from('email_inbox').insert({
    direction: 'out',
    source: 'reply',
    from_email: fromAddress(),
    to_email: msg.from_email,
    subject,
    text_body: body,
    meta: { in_reply_to: id, attachments: files.map(f => ({ filename: f.filename, path: f.path })) },
    is_read: true,
  });
  await supabase.from('email_inbox').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin/correos/bandeja');
  redirect(`/admin/correos/bandeja/${id}?enviado=1`);
}

export async function toggleRead(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id'));
  const read = formData.get('read') === 'true';
  await supabase.from('email_inbox').update({ is_read: read }).eq('id', id);
  revalidatePath('/admin/correos/bandeja');
}

export async function deleteMessage(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('email_inbox').delete().eq('id', String(formData.get('id')));
  revalidatePath('/admin/correos/bandeja');
  redirect('/admin/correos/bandeja');
}
