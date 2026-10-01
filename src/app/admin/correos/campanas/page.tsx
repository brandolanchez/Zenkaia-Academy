import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createCampaign, duplicateCampaign, deleteCampaign } from './actions';

export const dynamic = 'force-dynamic';

const STATUS: Record<string, string> = { draft: 'Borrador', sending: 'Enviando', sent: 'Enviada' };

export default async function CampanasPage() {
  const supabase = await createClient();
  const { data: campaigns, error } = await supabase
    .from('email_campaigns')
    .select('id, name, subject, status, audience_tag, sent_at, updated_at, email_sends(count)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="mail-stack">
      {error && <p className="mail-err">No se pudieron leer las campañas: {error.message}. ¿Ya corriste supabase/email-marketing.sql?</p>}

      <section className="mail-card">
        <form action={createCampaign} className="mail-inline-form">
          <input name="name" placeholder="Nombre de la nueva campaña" />
          <button type="submit" className="mail-btn mail-btn-primary">Crear campaña</button>
        </form>
      </section>

      <section className="mail-card">
        <div className="mail-table-wrap">
          <table className="mail-table">
            <thead><tr><th>Campaña</th><th>Asunto</th><th>Audiencia</th><th>Estado</th><th>Enviados</th><th></th></tr></thead>
            <tbody>
              {(campaigns || []).map(c => {
                const sends = (c.email_sends as unknown as { count: number }[])?.[0]?.count ?? 0;
                return (
                  <tr key={c.id}>
                    <td><Link href={`/admin/correos/campanas/${c.id}`} className="mail-link">{c.name}</Link></td>
                    <td className="mail-ellipsis">{c.subject || '—'}</td>
                    <td>{c.audience_tag ? <span className="mail-tag">{c.audience_tag}</span> : 'Todos'}</td>
                    <td><span className={`mail-status mail-status-${c.status}`}>{STATUS[c.status]}</span></td>
                    <td>{sends}</td>
                    <td className="mail-actions">
                      <Link href={`/admin/correos/campanas/${c.id}`} className="mail-btn-sm">{c.status === 'sent' ? 'Ver' : 'Editar'}</Link>
                      <form action={duplicateCampaign}><input type="hidden" name="id" value={c.id} /><button className="mail-btn-sm" type="submit">Duplicar</button></form>
                      {c.status === 'draft' && (
                        <form action={deleteCampaign}><input type="hidden" name="id" value={c.id} /><button className="mail-btn-sm mail-btn-danger" type="submit">Borrar</button></form>
                      )}
                    </td>
                  </tr>
                );
              })}
              {campaigns?.length === 0 && <tr><td colSpan={6} className="mail-empty">Aún no hay campañas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
