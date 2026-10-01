import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SOURCE: Record<string, string> = { email: 'Correo', form: 'Formulario web', reply: 'Respuesta enviada' };

export default async function BandejaPage({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { ver = 'recibidos' } = await searchParams;
  const supabase = await createClient();
  let q = supabase.from('email_inbox').select('id, direction, source, from_email, from_name, to_email, subject, is_read, created_at').order('created_at', { ascending: false }).limit(200);
  q = ver === 'enviados' ? q.eq('direction', 'out') : q.eq('direction', 'in');
  const { data: messages, error } = await q;

  return (
    <div className="mail-stack">
      <div className="mail-seg">
        <Link href="/admin/correos/bandeja" className={ver !== 'enviados' ? 'is-active' : ''}>Recibidos</Link>
        <Link href="/admin/correos/bandeja?ver=enviados" className={ver === 'enviados' ? 'is-active' : ''}>Enviados</Link>
      </div>
      {error && <p className="mail-err">No se pudo leer la bandeja: {error.message}</p>}
      <section className="mail-card mail-inbox">
        {(messages || []).map(m => (
          <Link key={m.id} href={`/admin/correos/bandeja/${m.id}`} className={`mail-inbox-row ${m.direction === 'in' && !m.is_read ? 'is-unread' : ''}`}>
            <span className="mail-inbox-from">{m.direction === 'out' ? `Para: ${m.to_email}` : m.from_name || m.from_email}</span>
            <span className="mail-inbox-subject">{m.subject || '(sin asunto)'}</span>
            <span className="mail-tag">{SOURCE[m.source] || m.source}</span>
            <time>{new Date(m.created_at).toLocaleString('es-VE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
          </Link>
        ))}
        {messages?.length === 0 && <p className="mail-empty">No hay mensajes todavía.</p>}
      </section>
    </div>
  );
}
