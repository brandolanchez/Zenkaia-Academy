import { createClient } from '@/lib/supabase/server';
import ImportContacts from './ImportContacts';
import { addContact, setContactStatus, deleteContact } from './actions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = { subscribed: 'Suscrito', unsubscribed: 'De baja', bounced: 'Rebotado' };

export default async function ContactosPage({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string; estado?: string }> }) {
  const { q = '', tag = '', estado = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('email_contacts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(300);
  if (q) query = query.or(`email.ilike.%${q.replace(/[%,()]/g, '')}%,name.ilike.%${q.replace(/[%,()]/g, '')}%,company.ilike.%${q.replace(/[%,()]/g, '')}%`);
  if (tag) query = query.contains('tags', [tag]);
  if (estado === 'baja') query = query.neq('status', 'subscribed');
  else if (estado === 'suscritos') query = query.eq('status', 'subscribed');
  const { data: contacts, count, error } = await query;

  const { data: tagRows } = await supabase.from('email_contacts').select('tags').limit(5000);
  const allTags = Array.from(new Set((tagRows || []).flatMap(r => r.tags || []))).sort();

  return (
    <div className="mail-stack">
      {error && <p className="mail-err">No se pudieron leer los contactos: {error.message}. ¿Ya corriste supabase/email-marketing.sql?</p>}

      <div className="mail-grid-2">
        <ImportContacts />
        <section className="mail-card">
          <h2>Agregar un contacto</h2>
          <form action={addContact} className="mail-form">
            <label className="mail-field"><span>Correo *</span><input name="email" type="email" required /></label>
            <div className="mail-row">
              <label className="mail-field"><span>Nombre</span><input name="name" /></label>
              <label className="mail-field"><span>Empresa</span><input name="company" /></label>
            </div>
            <div className="mail-row">
              <label className="mail-field"><span>Teléfono</span><input name="phone" /></label>
              <label className="mail-field"><span>Etiquetas</span><input name="tags" defaultValue="sponsor" /></label>
            </div>
            <button type="submit" className="mail-btn">Guardar contacto</button>
          </form>
        </section>
      </div>

      <section className="mail-card">
        <form className="mail-filters" method="get">
          <input name="q" defaultValue={q} placeholder="Buscar por correo, nombre o empresa" />
          <select name="tag" defaultValue={tag}>
            <option value="">Todas las etiquetas</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select name="estado" defaultValue={estado}>
            <option value="">Todos</option>
            <option value="suscritos">Suscritos</option>
            <option value="baja">De baja / rebotados</option>
          </select>
          <button type="submit" className="mail-btn">Filtrar</button>
        </form>

        <p className="mail-muted">{count ?? 0} contactos{(count ?? 0) > 300 ? ' (mostrando los 300 más recientes)' : ''}</p>

        <div className="mail-table-wrap">
          <table className="mail-table">
            <thead>
              <tr><th>Correo</th><th>Nombre</th><th>Empresa</th><th>Etiquetas</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {(contacts || []).map(c => (
                <tr key={c.id}>
                  <td>{c.email}</td>
                  <td>{c.name || '—'}</td>
                  <td>{c.company || '—'}</td>
                  <td>{(c.tags || []).map((t: string) => <span key={t} className="mail-tag">{t}</span>)}</td>
                  <td><span className={`mail-status mail-status-${c.status}`}>{STATUS_LABEL[c.status] || c.status}</span></td>
                  <td className="mail-actions">
                    <form action={setContactStatus}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value={c.status === 'subscribed' ? 'unsubscribed' : 'subscribed'} />
                      <button type="submit" className="mail-btn-sm">{c.status === 'subscribed' ? 'Dar de baja' : 'Reactivar'}</button>
                    </form>
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="mail-btn-sm mail-btn-danger">Borrar</button>
                    </form>
                  </td>
                </tr>
              ))}
              {contacts?.length === 0 && (
                <tr><td colSpan={6} className="mail-empty">No hay contactos con estos filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
