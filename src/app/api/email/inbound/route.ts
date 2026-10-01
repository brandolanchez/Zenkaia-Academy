import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyResendWebhook, parseAddress } from '@/lib/email/webhook';
import { getReceivedEmail, sendEmail } from '@/lib/email/resend';

// Webhook de Resend para correos recibidos (evento "email.received").
// URL a configurar en Resend → Webhooks: https://zenkai.fortisworkout.org/api/email/inbound
export async function POST(request: Request) {
  const raw = await request.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || !verifyResendWebhook(raw, request.headers, secret)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  let event: { type?: string; data?: { email_id?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  if (event.type !== 'email.received' || !event.data?.email_id) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const email = await getReceivedEmail(event.data.email_id);
  const from = parseAddress(email.from);
  const supabase = createAdminClient();

  const { error } = await supabase.from('email_inbox').upsert(
    {
      direction: 'in',
      source: 'email',
      resend_email_id: email.id,
      message_id: email.message_id ?? null,
      from_email: from.email,
      from_name: from.name,
      to_email: (email.to || []).join(', '),
      subject: email.subject,
      text_body: email.text,
      html_body: email.html,
      created_at: email.created_at,
    },
    { onConflict: 'resend_email_id', ignoreDuplicates: true }
  );
  if (error) {
    console.error('inbox insert', error);
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  }

  // Si el remitente es un contacto, lo marcamos con la etiqueta "respondio"
  const { data: contact } = await supabase.from('email_contacts').select('id, tags').ilike('email', from.email).maybeSingle();
  if (contact && !contact.tags?.includes('respondio')) {
    await supabase.from('email_contacts').update({ tags: [...(contact.tags || []), 'respondio'], updated_at: new Date().toISOString() }).eq('id', contact.id);
  }

  const forwardTo = process.env.EMAIL_FORWARD_TO;
  if (forwardTo) {
    try {
      await sendEmail({
        to: forwardTo,
        subject: `[Bandeja] ${email.subject || '(sin asunto)'} — ${from.name || from.email}`,
        html: `<p><strong>De:</strong> ${from.name ? `${from.name} &lt;${from.email}&gt;` : from.email}</p><hr>${email.html || `<pre>${(email.text || '').replace(/</g, '&lt;')}</pre>`}`,
        reply_to: from.email,
      });
    } catch (e) {
      console.error('forward', e);
    }
  }

  return NextResponse.json({ ok: true });
}
