'use client';

import { useState } from 'react';
import { importContacts, type ImportRow } from './actions';

// Reconoce encabezados en español o inglés
const HEADER_MAP: Record<string, keyof ImportRow> = {
  email: 'email', correo: 'email', 'correo electronico': 'email', 'correo electrónico': 'email', 'e-mail': 'email', mail: 'email',
  nombre: 'name', name: 'name', contacto: 'name', 'nombre completo': 'name',
  empresa: 'company', company: 'company', marca: 'company', compañia: 'company', compañía: 'company', negocio: 'company',
  telefono: 'phone', teléfono: 'phone', phone: 'phone', whatsapp: 'phone', celular: 'phone',
  etiquetas: 'tags', etiqueta: 'tags', tags: 'tags', categoria: 'tags', categoría: 'tags', segmento: 'tags',
};

type Cell = string | number | boolean | Date | null | undefined;

function rowsToContacts(rows: Cell[][]): { contacts: ImportRow[]; columns: string[] } {
  if (rows.length === 0) return { contacts: [], columns: [] };
  const header = rows[0].map(h => String(h ?? '').trim().toLowerCase());
  const mapping = header.map(h => HEADER_MAP[h]);
  const emailIdx = mapping.indexOf('email');
  const columns = header.filter((_, i) => mapping[i]).map((h, i) => `${h} → ${mapping.filter(Boolean)[i]}`);

  // Sin encabezado reconocible: buscamos la columna que tenga correos
  const body = emailIdx === -1 ? rows : rows.slice(1);
  const contacts: ImportRow[] = [];
  for (const r of body) {
    const c: ImportRow = { email: '' };
    if (emailIdx === -1) {
      const found = r.find(v => /@/.test(String(v ?? '')));
      if (!found) continue;
      c.email = String(found).trim();
    } else {
      r.forEach((v, i) => {
        const key = mapping[i];
        const val = String(v ?? '').trim();
        if (!key || !val) return;
        if (key === 'tags') c.tags = val.split(/[,;]/);
        else (c as Record<string, unknown>)[key] = val;
      });
    }
    if (c.email) contacts.push(c);
  }
  return { contacts, columns };
}

function parseCsv(text: string): string[][] {
  const sep = (text.split('\n')[0].match(/;/g)?.length ?? 0) > (text.split('\n')[0].match(/,/g)?.length ?? 0) ? ';' : ',';
  const out: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); out.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  return out.filter(r => r.some(c => c.trim()));
}

export default function ImportContacts() {
  const [contacts, setContacts] = useState<ImportRow[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [tags, setTags] = useState('sponsor');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(null); setErr(null); setContacts(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      let rows: Cell[][];
      if (/\.csv$/i.test(file.name)) {
        rows = parseCsv(await file.text());
      } else {
        const { readSheet } = await import('read-excel-file/universal');
        rows = (await readSheet(file)) as Cell[][];
      }
      const parsed = rowsToContacts(rows);
      if (parsed.contacts.length === 0) throw new Error('No encontramos correos en el archivo. Revisa que haya una columna "correo" o "email".');
      setContacts(parsed.contacts);
      setColumns(parsed.columns);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'No se pudo leer el archivo.');
    }
  };

  const onImport = async () => {
    if (!contacts) return;
    setBusy(true); setErr(null);
    try {
      const res = await importContacts(contacts, tags.split(','));
      setMsg(`Listo: ${res.inserted} nuevos, ${res.updated} actualizados${res.invalid ? `, ${res.invalid} con correo inválido (omitidos)` : ''}.`);
      setContacts(null);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'No se pudo importar.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mail-card">
      <h2>Importar contactos</h2>
      <p className="mail-muted">
        Sube un Excel (.xlsx) o CSV. La primera fila debe tener los títulos de columna: <code>correo</code> (obligatoria), <code>nombre</code>, <code>empresa</code>, <code>telefono</code>, <code>etiquetas</code>. Si un correo ya existe, se actualiza; si esa persona se dio de baja, sigue de baja.
      </p>
      <a className="mail-link" href="/plantilla-contactos.csv" download>Descargar plantilla</a>

      <label className="mail-file">
        <input type="file" accept=".xlsx,.csv" onChange={onFile} />
        <span>{fileName || 'Elegir archivo…'}</span>
      </label>

      {contacts && (
        <div className="mail-preview">
          <p><strong>{contacts.length}</strong> contactos encontrados{columns.length ? ` · columnas: ${columns.join(', ')}` : ''}</p>
          <table className="mail-table">
            <thead><tr><th>Correo</th><th>Nombre</th><th>Empresa</th><th>Etiquetas</th></tr></thead>
            <tbody>
              {contacts.slice(0, 5).map((c, i) => (
                <tr key={i}><td>{c.email}</td><td>{c.name || '—'}</td><td>{c.company || '—'}</td><td>{c.tags?.join(', ') || '—'}</td></tr>
              ))}
            </tbody>
          </table>
          {contacts.length > 5 && <p className="mail-muted">…y {contacts.length - 5} más.</p>}
          <label className="mail-field">
            <span>Etiquetas para todos (separadas por coma)</span>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="sponsor, maracaibo" />
          </label>
          <button type="button" className="mail-btn mail-btn-primary" onClick={onImport} disabled={busy}>
            {busy ? 'Importando…' : `Importar ${contacts.length} contactos`}
          </button>
        </div>
      )}
      {msg && <p className="mail-ok">{msg}</p>}
      {err && <p className="mail-err">{err}</p>}
    </section>
  );
}
