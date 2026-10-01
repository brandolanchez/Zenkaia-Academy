'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { replyMessage } from '../actions';

const MAX_FILES = 10;
const MAX_TOTAL = 25 * 1024 * 1024; // Resend acepta hasta 40 MB por correo; dejamos margen

const fmtSize = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

const safeName = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_').slice(-80);

export default function ReplyForm({ id, defaultBody }: { id: string; defaultBody: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = files.reduce((a, f) => a + f.size, 0);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, MAX_FILES);
    if (next.reduce((a, f) => a + f.size, 0) > MAX_TOTAL) {
      setError('Los adjuntos no pueden pasar de 25 MB en total.');
      return;
    }
    setError(null);
    setFiles(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!String(fd.get('body') || '').trim()) return;
    setBusy(true);
    setError(null);
    try {
      // Los archivos se suben primero a Supabase (privado) y Resend los descarga con un enlace temporal
      const supabase = createClient();
      const uploaded: { path: string; filename: string }[] = [];
      for (const f of files) {
        const path = `replies/${id}/${Date.now()}-${safeName(f.name)}`;
        const { error: upErr } = await supabase.storage.from('email-attachments').upload(path, f, { contentType: f.type || 'application/octet-stream' });
        if (upErr) throw new Error(upErr.message.includes('not found') ? 'Falta crear el espacio de adjuntos: corre supabase/email-adjuntos.sql.' : `No se pudo subir ${f.name}: ${upErr.message}`);
        uploaded.push({ path, filename: f.name });
      }
      fd.set('attachments', JSON.stringify(uploaded));
      const res = await replyMessage(fd);
      if (res?.error) {
        setError(res.error);
        setBusy(false);
      }
    } catch (err) {
      // redirect() de Next lanza un error especial: hay que dejarlo pasar
      if (err && typeof err === 'object' && 'digest' in err && String((err as { digest?: string }).digest).startsWith('NEXT_REDIRECT')) throw err;
      setError(err instanceof Error ? err.message : 'No se pudo enviar la respuesta.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mail-form">
      <input type="hidden" name="id" value={id} />
      <textarea name="body" rows={8} required defaultValue={defaultBody} />

      <div className="mail-attach">
        {files.length > 0 && (
          <ul className="mail-attach-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span>📎 {f.name} · {fmtSize(f.size)}</span>
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} disabled={busy}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
        <div className="mail-inline-form">
          <button type="button" className="mail-btn" onClick={() => inputRef.current?.click()} disabled={busy || files.length >= MAX_FILES}>
            Adjuntar archivos
          </button>
          <small className="mail-muted">{files.length ? `${files.length} archivo(s) · ${fmtSize(total)} de 25 MB` : 'PDF, imágenes o documentos. Máx. 25 MB en total.'}</small>
        </div>
        <input ref={inputRef} type="file" multiple hidden onChange={e => addFiles(e.target.files)} />
      </div>

      {error && <p className="mail-err">{error}</p>}
      <button type="submit" className="mail-btn mail-btn-primary" disabled={busy}>
        {busy ? (files.length ? 'Subiendo y enviando…' : 'Enviando…') : 'Enviar respuesta'}
      </button>
    </form>
  );
}
