import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { replyMessage, toggleRead, deleteMessage } from '../actions';

export const dynamic = 'force-dynamic';

export default async function MensajePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ enviado?: string }> }) {
  const { id } = await params;
  const { enviado } = await searchParams;
  const supabase = await createClient();
  const { data: m } = await supabase.from('email_inbox').select('*').eq('id', id).maybeSingle();
  if (!m) notFound();
  if (m.direction === 'in' && !m.is_read) {
    await supabase.from('email_inbox').update({ is_read: true }).eq('id', id);
  }
  const { data: replies } = await supabase.from('email_inbox').select('id, text_body, created_at').eq('direction', 'out').contains('meta', { in_reply_to: id }).order('created_at');

  return (
    <div className="mail-stack">
      <Link href="/admin/correos/bandeja" className="mail-link">← Volver a la bandeja</Link>
      <section className="mail-card">
        <div className="mail-msg-head">
          <div>
            <h2>{m.subject || '(sin asunto)'}</h2>
            <p className="mail-muted">
              {m.direction === 'in' ? <>De: <strong>{m.from_name ? `${m.from_name} <${m.from_email}>` : m.from_email}</strong></> : <>Para: <strong>{m.to_email}</strong></>}
              {' · '}{new Date(m.created_at).toLocaleString('es-VE')}
            </p>
          </div>
          <div className="mail-actions">
            <form action={toggleRead}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="read" value="false" /><button className="mail-btn-sm" type="submit">Marcar no leído</button></form>
            <form action={deleteMessage}><input type="hidden" name="id" value={m.id} /><button className="mail-btn-sm mail-btn-danger" type="submit">Borrar</button></form>
          </div>
        </div>

        {m.html_body ? (
          <iframe title="Contenido del correo" className="mail-msg-frame" srcDoc={m.html_body} sandbox="" />
        ) : (
          <pre className="mail-msg-text">{m.text_body}</pre>
        )}
      </section>

      {(replies || []).map(r => (
        <section key={r.id} className="mail-card mail-reply-sent">
          <p className="mail-muted">Tu respuesta · {new Date(r.created_at).toLocaleString('es-VE')}</p>
          <pre className="mail-msg-text">{r.text_body}</pre>
        </section>
      ))}

      {m.direction === 'in' && (
        <section className="mail-card">
          <h2>Responder a {m.from_name || m.from_email}</h2>
          {enviado && <p className="mail-ok">Respuesta enviada.</p>}
          <form action={replyMessage} className="mail-form">
            <input type="hidden" name="id" value={m.id} />
            <textarea name="body" rows={8} required defaultValue={`Hola ${m.from_name?.split(' ')[0] || ''},\n\n`} />
            <button type="submit" className="mail-btn mail-btn-primary">Enviar respuesta</button>
          </form>
        </section>
      )}
    </div>
  );
}
