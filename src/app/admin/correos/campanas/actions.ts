'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { renderEmail, personalize, unsubscribeUrl, oneClickUnsubscribeUrl, hasPhotoPlaceholder } from '@/lib/email/render';
import { sendBatch, sendEmail, type OutgoingEmail } from '@/lib/email/resend';
import { fromAddress } from '@/lib/email/config';

const BATCH = 100;

export type CampaignInput = {
  name: string;
  subject: string;
  preheader: string;
  body: string;
  audience_tag: string | null;
  exclude_replied: boolean;
  after_campaigns: string[];
  wait_days: number;
  template: 'personal' | 'marca';
};

type Supa = Awaited<ReturnType<typeof requireAdmin>>['supabase'];
type CampaignRow = { audience_tag: string | null; exclude_replied: boolean; after_campaigns: string[] | null; wait_days: number | null };
type ContactRow = { id: string; email: string; name: string | null; company: string | null; unsubscribe_token: string };

// Supabase devuelve máximo 1000 filas por consulta: paginamos.
async function fetchAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await page(from, from + 999);
    if (error) throw new Error(error.message);
    out.push(...(data || []));
    if (!data || data.length < 1000) return out;
  }
}

// Contactos que deben recibir la campaña y todavía no la tienen
async function pendingContacts(supabase: Supa, id: string, c: CampaignRow) {
  const contacts = await fetchAll<ContactRow>((from, to) => {
    let q = supabase.from('email_contacts').select('id, email, name, company, unsubscribe_token').eq('status', 'subscribed');
    if (c.audience_tag) q = q.contains('tags', [c.audience_tag]);
    if (c.exclude_replied) q = q.not('tags', 'cs', '{respondio}');
    return q.order('created_at').range(from, to);
  });

  // Secuencia: solo quien recibió alguno de los correos anteriores hace X días
  let eligible = contacts;
  if (c.after_campaigns?.length) {
    const cutoff = new Date(Date.now() - (c.wait_days ?? 0) * 86_400_000).toISOString();
    const prev = await fetchAll<{ contact_id: string }>((from, to) =>
      supabase.from('email_sends').select('contact_id').in('campaign_id', c.after_campaigns!).eq('status', 'sent').lte('created_at', cutoff).range(from, to)
    );
    const ok = new Set(prev.map(p => p.contact_id));
    eligible = contacts.filter(ct => ok.has(ct.id));
  }

  // Ya enviados (incluye fallidos para no reintentar en bucle)
  const done = await fetchAll<{ contact_id: string }>((from, to) =>
    supabase.from('email_sends').select('contact_id').eq('campaign_id', id).range(from, to)
  );
  const doneIds = new Set(done.map(d => d.contact_id));
  return { eligible: eligible.length, pending: eligible.filter(ct => !doneIds.has(ct.id)) };
}

export async function createCampaign(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get('name') || '').trim() || 'Campaña sin nombre';
  const { data, error } = await supabase.from('email_campaigns').insert({ name, audience_tag: 'sponsor' }).select('id').single();
  if (error) throw new Error(error.message);
  redirect(`/admin/correos/campanas/${data.id}`);
}

export async function duplicateCampaign(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id'));
  const { data: c } = await supabase.from('email_campaigns').select('*').eq('id', id).single();
  if (!c) return;
  const { data } = await supabase.from('email_campaigns').insert({
    name: `${c.name} (copia)`, subject: c.subject, preheader: c.preheader, body: c.body, audience_tag: c.audience_tag, sort_order: c.sort_order, exclude_replied: c.exclude_replied,
    after_campaigns: c.after_campaigns ?? [], wait_days: c.wait_days ?? 0, template: c.template ?? 'personal',
  }).select('id').single();
  revalidatePath('/admin/correos/campanas');
  if (data) redirect(`/admin/correos/campanas/${data.id}`);
}

export async function deleteCampaign(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('email_campaigns').delete().eq('id', String(formData.get('id'))).eq('status', 'draft');
  revalidatePath('/admin/correos/campanas');
}

export async function saveCampaign(id: string, input: CampaignInput) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('email_campaigns').update({
    name: input.name.trim() || 'Campaña sin nombre',
    subject: input.subject,
    preheader: input.preheader,
    body: input.body,
    audience_tag: input.audience_tag || null,
    exclude_replied: input.exclude_replied,
    after_campaigns: (input.after_campaigns || []).filter(x => x !== id),
    template: input.template === 'marca' ? 'marca' : 'personal',
    wait_days: Math.max(0, Math.min(60, Math.round(Number(input.wait_days) || 0))),
    updated_at: new Date().toISOString(),
  }).eq('id', id).neq('status', 'sent');
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/correos/campanas/${id}`);
  revalidatePath('/admin/correos/campanas');
  return { ok: true };
}

export async function sendTest(input: CampaignInput, to: string) {
  await requireAdmin();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error('Correo de prueba inválido.');
  const recipient = { name: 'María Pérez', company: 'Tu Empresa', email: to };
  const { html, text } = renderEmail({ body: input.body, preheader: input.preheader, template: input.template, recipient, unsubscribeUrl: unsubscribeUrl('00000000-0000-0000-0000-000000000000') });
  await sendEmail({ to, subject: `[Prueba] ${personalize(input.subject, recipient)}`, html, text, reply_to: fromAddress() });
  return { ok: true };
}

// Cuenta a quién le toca recibir la campaña hoy
export async function audienceStatus(id: string) {
  const { supabase } = await requireAdmin();
  const { data: c } = await supabase.from('email_campaigns').select('audience_tag, exclude_replied, after_campaigns, wait_days').eq('id', id).single();
  if (!c) throw new Error('Campaña no encontrada.');
  const { eligible, pending } = await pendingContacts(supabase, id, c);
  const { count: sent } = await supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'sent');
  return { audience: eligible, sent: sent ?? 0, pending: pending.length };
}

// Envía la siguiente tanda (máx. 100, o menos si se pide) a quienes aún no la recibieron.
// El editor la llama en bucle hasta llegar al límite del día o a remaining = 0.
export async function sendNextBatch(id: string, max = BATCH) {
  const { supabase } = await requireAdmin();
  const { data: c, error } = await supabase.from('email_campaigns').select('*').eq('id', id).single();
  if (error || !c) throw new Error('Campaña no encontrada.');
  if (!c.subject.trim() || !c.body.trim()) throw new Error('La campaña necesita asunto y contenido.');
  if (hasPhotoPlaceholder(c.body)) throw new Error('Este correo tiene una foto pendiente ([FOTO: …]). Súbela con el botón Imagen o borra esa línea antes de enviar.');
  if (!process.env.RESEND_API_KEY) throw new Error('Falta configurar RESEND_API_KEY en Netlify.');

  const { pending } = await pendingContacts(supabase, id, c);
  const batch = pending.slice(0, Math.max(1, Math.min(BATCH, Math.floor(max))));

  if (batch.length > 0 && c.status !== 'sending') {
    await supabase.from('email_campaigns').update({ status: 'sending' }).eq('id', id);
  }

  if (batch.length === 0) {
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
    revalidatePath('/admin/correos/campanas');
    return { sent: 0, failed: 0, remaining: 0 };
  }

  const emails: OutgoingEmail[] = batch.map(ct => {
    const recipient = { name: ct.name, company: ct.company, email: ct.email };
    const { html, text } = renderEmail({ body: c.body, preheader: c.preheader, template: c.template, recipient, unsubscribeUrl: unsubscribeUrl(ct.unsubscribe_token) });
    return {
      to: ct.email,
      subject: personalize(c.subject, recipient),
      html,
      text,
      reply_to: fromAddress(),
      headers: {
        'List-Unsubscribe': `<${oneClickUnsubscribeUrl(ct.unsubscribe_token)}>, <mailto:${fromAddress()}?subject=baja>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    };
  });

  const result = await sendBatch(emails);
  const rows = batch.map((ct, i) => ({
    campaign_id: id,
    contact_id: ct.id,
    resend_id: result.ids[i],
    status: result.ids[i] ? 'sent' : 'failed',
    error: result.ids[i] ? null : result.error ?? 'Sin respuesta de Resend',
  }));
  await supabase.from('email_sends').upsert(rows, { onConflict: 'campaign_id,contact_id', ignoreDuplicates: true });

  // Si toda la tanda falló, detenemos el envío para no marcar a todos como fallidos
  if (result.error && result.ids.every(x => !x)) {
    await supabase.from('email_sends').delete().eq('campaign_id', id).eq('status', 'failed').in('contact_id', batch.map(b => b.id));
    throw new Error(`Resend rechazó el envío: ${result.error}`);
  }

  const sent = rows.filter(r => r.status === 'sent').length;
  const remaining = pending.length - batch.length;
  // "Enviada" = todos los que hoy cumplen las condiciones ya la recibieron.
  // Si mañana entran contactos nuevos, se puede seguir enviando.
  if (remaining === 0) {
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
  }
  revalidatePath(`/admin/correos/campanas/${id}`);
  revalidatePath('/admin/correos/campanas');
  return { sent, failed: rows.length - sent, remaining };
}
