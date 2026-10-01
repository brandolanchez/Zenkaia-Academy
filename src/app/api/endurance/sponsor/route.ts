import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { renderEmail } from '@/lib/email/render';

// Formulario de patrocinio de endurance.fortisworkout.org
// 1) Guarda la solicitud en la bandeja del admin (Admin → Correos → Bandeja)
// 2) Agrega o actualiza a la persona como contacto con la etiqueta "sponsor"
// 3) Le envía una confirmación y, si EMAIL_FORWARD_TO está configurado, te reenvía el aviso

const field = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escape = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  // Bots: si llenaron el campo oculto, respondemos OK sin hacer nada
  if (field(body.website, 200)) return NextResponse.json({ ok: true });

  const name = field(body.name, 100);
  const company = field(body.company, 120);
  const email = field(body.email, 160).toLowerCase();
  const phone = field(body.phone, 40);
  const message = field(body.message, 2000);

  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Revisa tu nombre, empresa y correo.' }, { status: 400 });
  }

  let saved = false;
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('email_inbox').insert({
      direction: 'in',
      source: 'form',
      from_email: email,
      from_name: name,
      subject: `Solicitud de patrocinio: ${company}`,
      text_body: `Empresa: ${company}\nTeléfono: ${phone || '—'}\n\n${message || '(sin mensaje)'}`,
      meta: { company, phone },
    });
    saved = !error;
    if (error) console.error('sponsor inbox', error);

    const { data: existing } = await supabase.from('email_contacts').select('id, tags').ilike('email', email).maybeSingle();
    if (existing) {
      const tags = Array.from(new Set([...(existing.tags || []), 'sponsor', 'lead-web']));
      await supabase.from('email_contacts').update({ name, company, phone: phone || null, tags, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('email_contacts').insert({ email, name, company, phone: phone || null, tags: ['sponsor', 'lead-web'], source: 'formulario' });
    }
  } catch (e) {
    console.error('sponsor save', e);
  }

  let notified = false;
  if (process.env.RESEND_API_KEY) {
    // Confirmación para la marca
    try {
      const { html, text } = renderEmail({
        recipient: { name, company, email },
        preheader: 'Te enviamos la propuesta en las próximas 24 horas.',
        template: 'marca',
        body: `Hola {{nombre|}},\n\nGracias por escribirnos. Recibimos el interés de **{{empresa|tu marca}}** en patrocinar **Endurance at the Limit**.\n\n**En las próximas 24 horas** te respondo a este correo con la propuesta: niveles de patrocinio, qué incluye cada uno y opciones en efectivo o en especie.\n\nSi prefieres adelantarlo, escríbeme por [WhatsApp al 0412-613-4013](https://wa.me/584126134013). Fotos y videos de ediciones anteriores en [Instagram @fortisworkout](https://www.instagram.com/fortisworkout/).`,
      });
      await sendEmail({ to: email, subject: 'Recibimos tu solicitud de patrocinio', html, text });
      notified = true;
    } catch (e) {
      console.error('sponsor confirm', e);
    }

    // Aviso interno opcional
    const forwardTo = process.env.EMAIL_FORWARD_TO || process.env.ENDURANCE_CONTACT_TO;
    if (forwardTo) {
      try {
        await sendEmail({
          to: forwardTo,
          reply_to: email,
          subject: `Patrocinio Endurance: ${company}`,
          html: `<h2>Nueva solicitud de patrocinio</h2><p><strong>Nombre:</strong> ${escape(name)}<br><strong>Empresa:</strong> ${escape(company)}<br><strong>Correo:</strong> ${escape(email)}<br><strong>Teléfono:</strong> ${escape(phone || '—')}</p><p>${escape(message || '—').replace(/\n/g, '<br>')}</p>`,
        });
      } catch (e) {
        console.error('sponsor forward', e);
      }
    }
  }

  if (!saved && !notified) {
    return NextResponse.json({ error: 'No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
