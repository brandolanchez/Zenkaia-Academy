'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { sendEmail } from '@/lib/email/resend';
import { renderEmail } from '@/lib/email/render';
import { fromAddress } from '@/lib/email/config';

export async function replyMessage(formData: FormData) {
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
  await sendEmail({ to: msg.from_email, subject, html, text, reply_to: fromAddress(), headers });

  await supabase.from('email_inbox').insert({
    direction: 'out',
    source: 'reply',
    from_email: fromAddress(),
    to_email: msg.from_email,
    subject,
    text_body: body,
    meta: { in_reply_to: id },
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
