import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EMAIL_FROM } from '@/lib/email/config';

export const dynamic = 'force-dynamic';

export default async function CorreosResumen() {
  const supabase = await createClient();
  const [subs, unsubs, campaigns, unread] = await Promise.all([
    supabase.from('email_contacts').select('id', { count: 'exact', head: true }).eq('status', 'subscribed'),
    supabase.from('email_contacts').select('id', { count: 'exact', head: true }).neq('status', 'subscribed'),
    supabase.from('email_campaigns').select('id', { count: 'exact', head: true }),
    supabase.from('email_inbox').select('id', { count: 'exact', head: true }).eq('direction', 'in').eq('is_read', false),
  ]);

  const tablesMissing = !!subs.error;
  const checks = [
    { ok: !tablesMissing, label: 'Tablas de correo creadas en Supabase', help: 'Corre supabase/email-marketing.sql en el SQL Editor.' },
    { ok: !!process.env.RESEND_API_KEY, label: 'RESEND_API_KEY configurada', help: 'Netlify → Site configuration → Environment variables.' },
    { ok: !!process.env.SUPABASE_SERVICE_ROLE_KEY, label: 'SUPABASE_SERVICE_ROLE_KEY configurada', help: 'Necesaria para el formulario, la baja y los correos recibidos.' },
    { ok: !!process.env.RESEND_WEBHOOK_SECRET, label: 'Webhook de correos recibidos configurado', help: 'Resend → Webhooks → email.received → https://zenkai.fortisworkout.org/api/email/inbound' },
  ];

  return (
    <div className="mail-stack">
      <div className="mail-stats">
        <Link href="/admin/correos/contactos" className="mail-stat"><strong>{subs.count ?? 0}</strong><span>contactos suscritos</span></Link>
        <Link href="/admin/correos/contactos?estado=baja" className="mail-stat"><strong>{unsubs.count ?? 0}</strong><span>dados de baja o rebotados</span></Link>
        <Link href="/admin/correos/campanas" className="mail-stat"><strong>{campaigns.count ?? 0}</strong><span>campañas</span></Link>
        <Link href="/admin/correos/bandeja" className="mail-stat"><strong>{unread.count ?? 0}</strong><span>mensajes sin leer</span></Link>
      </div>

      <section className="mail-card">
        <h2>Configuración</h2>
        <p className="mail-muted">Remitente: <strong>{EMAIL_FROM}</strong></p>
        <ul className="mail-checks">
          {checks.map(c => (
            <li key={c.label} className={c.ok ? 'is-ok' : 'is-missing'}>
              <span>{c.ok ? '✓' : '!'}</span>
              <div><strong>{c.label}</strong>{!c.ok && <small>{c.help}</small>}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
