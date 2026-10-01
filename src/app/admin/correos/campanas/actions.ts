'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { renderEmail, personalize, unsubscribeUrl, oneClickUnsubscribeUrl } from '@/lib/email/render';
import { sendBatch, sendEmail, type OutgoingEmail } from '@/lib/email/resend';
import { fromAddress } from '@/lib/email/config';

const BATCH = 100;

export type CampaignInput = { name: string; subject: string; preheader: string; body: string; audience_tag: string | null; exclude_replied: boolean };

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
  const { html, text } = renderEmail({ body: input.body, preheader: input.preheader, recipient, unsubscribeUrl: unsubscribeUrl('00000000-0000-0000-0000-000000000000') });
  await sendEmail({ to, subject: `[Prueba] ${personalize(input.subject, recipient)}`, html, text, reply_to: fromAddress() });
  return { ok: true };
}

// Cuenta a quién le falta recibir la campaña
export async function audienceStatus(id: string) {
  const { supabase } = await requireAdmin();
  const { data: c } = await supabase.from('email_campaigns').select('audience_tag, exclude_replied').eq('id', id).single();
  let q = supabase.from('email_contacts').select('id', { count: 'exact', head: true }).eq('status', 'subscribed');
  if (c?.audience_tag) q = q.contains('tags', [c.audience_tag]);
  if (c?.exclude_replied) q = q.not('tags', 'cs', '{respondio}');
  const { count: audience } = await q;
  const { count: sent } = await supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', 'sent');
  return { audience: audience ?? 0, sent: sent ?? 0 };
}

// Envía la siguiente tanda (máx. 100) a quienes aún no la recibieron.
// El editor la llama en bucle hasta que remaining = 0.
export async function sendNextBatch(id: string) {
  const { supabase } = await requireAdmin();
  const { data: c, error } = await supabase.from('email_campaigns').select('*').eq('id', id).single();
  if (error || !c) throw new Error('Campaña no encontrada.');
  if (!c.subject.trim() || !c.body.trim()) throw new Error('La campaña necesita asunto y contenido.');
  if (!process.env.RESEND_API_KEY) throw new Error('Falta configurar RESEND_API_KEY en Netlify.');

  if (c.status === 'draft') {
    await supabase.from('email_campaigns').update({ status: 'sending' }).eq('id', id);
  }

  // Contactos ya enviados (incluye fallidos para no reintentar en bucle)
  const { data: done } = await supabase.from('email_sends').select('contact_id').eq('campaign_id', id);
  const doneIds = new Set((done || []).map(d => d.contact_id));

  let q = supabase.from('email_contacts').select('id, email, name, company, unsubscribe_token').eq('status', 'subscribed').order('created_at').limit(5000);
  if (c.audience_tag) q = q.contains('tags', [c.audience_tag]);
  if (c.exclude_replied) q = q.not('tags', 'cs', '{respondio}');
  const { data: contacts } = await q;
  const pending = (contacts || []).filter(ct => !doneIds.has(ct.id));
  const batch = pending.slice(0, BATCH);

  if (batch.length === 0) {
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
    revalidatePath('/admin/correos/campanas');
    return { sent: 0, failed: 0, remaining: 0 };
  }

  const emails: OutgoingEmail[] = batch.map(ct => {
    const recipient = { name: ct.name, company: ct.company, email: ct.email };
    const { html, text } = renderEmail({ body: c.body, preheader: c.preheader, recipient, unsubscribeUrl: unsubscribeUrl(ct.unsubscribe_token) });
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
  if (remaining === 0) {
    await supabase.from('email_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
  }
  revalidatePath(`/admin/correos/campanas/${id}`);
  revalidatePath('/admin/correos/campanas');
  return { sent, failed: rows.length - sent, remaining };
}
