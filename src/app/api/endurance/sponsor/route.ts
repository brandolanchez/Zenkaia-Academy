import { NextResponse } from 'next/server';

// Envía las solicitudes de patrocinio por correo usando la API de Resend.
// Variables de entorno (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY           clave de Resend
//   ENDURANCE_CONTACT_TO     correo que recibe las solicitudes
//   ENDURANCE_CONTACT_FROM   remitente verificado en Resend, ej. "Endurance <sponsors@fortisworkout.org>"

const escape = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const field = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  // Bots: si llenaron el campo oculto, respondemos OK sin enviar nada
  if (field(body.website, 200)) return NextResponse.json({ ok: true });

  const name = field(body.name, 100);
  const company = field(body.company, 120);
  const email = field(body.email, 160);
  const phone = field(body.phone, 40);
  const message = field(body.message, 2000);

  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Revisa tu nombre, empresa y correo.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENDURANCE_CONTACT_TO;
  const from = process.env.ENDURANCE_CONTACT_FROM;
  if (!apiKey || !to || !from) {
    console.error('Faltan RESEND_API_KEY, ENDURANCE_CONTACT_TO o ENDURANCE_CONTACT_FROM');
    return NextResponse.json({ error: 'El formulario no está disponible ahora. Escríbenos por WhatsApp.' }, { status: 500 });
  }

  const html = `
    <h2>Nueva solicitud de patrocinio · Endurance at the Limit</h2>
    <p><strong>Nombre:</strong> ${escape(name)}</p>
    <p><strong>Empresa:</strong> ${escape(company)}</p>
    <p><strong>Correo:</strong> ${escape(email)}</p>
    <p><strong>Teléfono:</strong> ${escape(phone || '—')}</p>
    <p><strong>Mensaje:</strong><br>${escape(message || '—').replace(/\n/g, '<br>')}</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Patrocinio Endurance: ${company}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text().catch(() => ''));
    return NextResponse.json({ error: 'No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
