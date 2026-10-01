'use client';

import { useMemo, useRef, useState } from 'react';
import { renderEmail, personalize, hasPhotoPlaceholder } from '@/lib/email/render';
import { createClient } from '@/lib/supabase/client';
import { saveCampaign, sendTest, sendNextBatch, audienceStatus, type CampaignInput } from '../actions';

type Campaign = {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  body: string;
  audience_tag: string | null;
  exclude_replied: boolean;
  after_campaigns: string[] | null;
  wait_days: number | null;
  template: 'personal' | 'marca' | null;
  status: 'draft' | 'sending' | 'sent';
  sent_at: string | null;
};

type Audience = { tag: string; label: string; count: number };

// Reduce la foto a máx. 1200 px de ancho en JPEG: queda liviana para el correo.
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const q of [0.82, 0.72, 0.62]) {
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', q));
    if (blob && (blob.size < 250_000 || q === 0.62)) return blob;
  }
  throw new Error('No se pudo procesar la imagen.');
}

const PHOTO_LINE = /^\[FOTO:\s*([^\]]*)\]$/i;

const SAMPLE = { name: 'María Pérez', company: 'Suplementos del Lago', email: 'maria@ejemplo.com' };

export default function CampaignEditor({
  campaign,
  audiences,
  sentCount,
  failedCount,
  otherCampaigns,
}: {
  campaign: Campaign;
  audiences: Audience[];
  sentCount: number;
  failedCount: number;
  otherCampaigns: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<CampaignInput>({
    name: campaign.name,
    subject: campaign.subject,
    preheader: campaign.preheader,
    body: campaign.body,
    audience_tag: campaign.audience_tag ?? '',
    exclude_replied: campaign.exclude_replied ?? true,
    after_campaigns: campaign.after_campaigns ?? [],
    wait_days: campaign.wait_days ?? 0,
    template: campaign.template ?? 'personal',
  });
  const [limit, setLimit] = useState(30);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testTo, setTestTo] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null);
  const [status, setStatus] = useState(campaign.status);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const pendingPhoto = hasPhotoPlaceholder(form.body);

  const locked = status === 'sent';
  const audience = audiences.find(a => a.tag === (form.audience_tag || '')) ?? audiences[0];

  const preview = useMemo(
    () => renderEmail({ body: form.body, preheader: form.preheader, template: form.template, recipient: SAMPLE, unsubscribeUrl: '#' }).html,
    [form.body, form.preheader, form.template]
  );

  const update = (patch: Partial<CampaignInput>) => {
    setForm(f => ({ ...f, ...patch }));
    setDirty(true);
  };

  const insert = (before: string, after = '', placeholder = '') => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = form.body.slice(start, end) || placeholder;
    const next = form.body.slice(0, start) + before + selected + after + form.body.slice(end);
    update({ body: next });
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length;
      el.setSelectionRange(pos, pos + selected.length);
    });
  };

  // Sube la foto y la coloca donde está el recordatorio [FOTO: …] (o donde esté el cursor)
  const onImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotice({ type: 'err', text: 'Elige un archivo de imagen (JPG, PNG o WEBP).' });
      return;
    }
    setUploading(true);
    setNotice(null);
    try {
      const blob = await compressImage(file);
      const supabase = createClient();
      const path = `campaigns/${campaign.id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage.from('email-assets').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
      if (error) throw new Error(error.message.includes('not found') ? 'Falta crear el espacio de imágenes: corre supabase/email-adjuntos.sql.' : error.message);
      const url = supabase.storage.from('email-assets').getPublicUrl(path).data.publicUrl;

      const el = bodyRef.current;
      const lines = form.body.split('\n');
      const cursor = el?.selectionStart ?? form.body.length;
      // Línea donde está el cursor
      let acc = 0;
      let cursorLine = lines.length - 1;
      for (let i = 0; i < lines.length; i++) {
        if (cursor <= acc + lines[i].length) { cursorLine = i; break; }
        acc += lines[i].length + 1;
      }
      const photoLines = lines.map((l, i) => (PHOTO_LINE.test(l.trim()) ? i : -1)).filter(i => i >= 0);
      const target = PHOTO_LINE.test(lines[cursorLine]?.trim() ?? '') ? cursorLine : photoLines.length === 1 ? photoLines[0] : -1;

      if (target >= 0) {
        const alt = (lines[target].trim().match(PHOTO_LINE)?.[1] || 'Endurance at the Limit').split('.')[0].trim();
        lines[target] = `![${alt}](${url})`;
        update({ body: lines.join('\n') });
      } else {
        update({ body: form.body.slice(0, cursor) + `\n\n![Endurance at the Limit](${url})\n\n` + form.body.slice(cursor) });
      }
      setNotice({ type: 'ok', text: 'Imagen agregada. Revisa la vista previa y guarda los cambios.' });
    } catch (e) {
      setNotice({ type: 'err', text: e instanceof Error ? e.message : 'No se pudo subir la imagen.' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const onSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await saveCampaign(campaign.id, form);
      setDirty(false);
      setNotice({ type: 'ok', text: 'Cambios guardados.' });
    } catch (e) {
      setNotice({ type: 'err', text: e instanceof Error ? e.message : 'No se pudo guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    setNotice(null);
    try {
      await sendTest(form, testTo.trim());
      setNotice({ type: 'ok', text: `Prueba enviada a ${testTo.trim()}.` });
    } catch (e) {
      setNotice({ type: 'err', text: e instanceof Error ? e.message : 'No se pudo enviar la prueba.' });
    }
  };

  const onSend = async () => {
    if (dirty) {
      setNotice({ type: 'err', text: 'Guarda los cambios antes de enviar.' });
      return;
    }
    setNotice(null);
    let st: { audience: number; sent: number; pending: number };
    try {
      st = await audienceStatus(campaign.id);
    } catch (e) {
      setNotice({ type: 'err', text: e instanceof Error ? e.message : 'No se pudo calcular la audiencia.' });
      return;
    }
    if (st.pending <= 0) {
      setNotice({
        type: 'err',
        text: form.after_campaigns.length
          ? 'Hoy no hay contactos pendientes: nadie cumple todavía los días de espera desde el correo anterior.'
          : 'No hay contactos pendientes para esta audiencia.',
      });
      return;
    }
    const cap = Math.max(1, Math.floor(limit) || 1);
    const toSend = Math.min(st.pending, cap);
    const rest = st.pending - toSend;
    if (!confirm(`Vas a enviar "${form.subject}" a ${toSend} contactos${rest > 0 ? ` (quedan ${rest} para los próximos días)` : ''}. ¿Continuar?`)) return;

    setSending(true);
    setStatus('sending');
    let done = 0;
    setProgress({ sent: 0, total: toSend });
    try {
      while (done < toSend) {
        const r = await sendNextBatch(campaign.id, Math.min(100, toSend - done));
        done += r.sent + r.failed;
        setProgress({ sent: done, total: toSend });
        if (r.remaining === 0 || r.sent + r.failed === 0) break;
      }
      const left = st.pending - done;
      setStatus(left > 0 ? 'sending' : 'sent');
      setNotice({ type: 'ok', text: left > 0 ? `Enviado a ${done} contactos. Quedan ${left} pendientes: vuelve mañana y dale a "Continuar envío".` : `Enviado a ${done} contactos.` });
    } catch (e) {
      setNotice({ type: 'err', text: `${e instanceof Error ? e.message : 'Error al enviar.'} Puedes volver a intentarlo: solo se envía a quien falta.` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mail-editor">
      <div className="mail-editor-form">
        <div className="mail-editor-top">
          <input className="mail-title-input" value={form.name} onChange={e => update({ name: e.target.value })} disabled={locked} aria-label="Nombre de la campaña" />
          <span className={`mail-status mail-status-${status}`}>{status === 'draft' ? 'Borrador' : status === 'sending' ? 'Enviando' : 'Enviada'}</span>
        </div>

        <label className="mail-field">
          <span>Asunto</span>
          <input value={form.subject} onChange={e => update({ subject: e.target.value })} disabled={locked} maxLength={150} />
          <small>{form.subject.length}/150 · Vista: “{personalize(form.subject, SAMPLE)}”</small>
        </label>

        <label className="mail-field">
          <span>Texto de vista previa</span>
          <input value={form.preheader} onChange={e => update({ preheader: e.target.value })} disabled={locked} maxLength={150} />
          <small>Aparece junto al asunto en la bandeja de entrada.</small>
        </label>

        <label className="mail-field">
          <span>Audiencia</span>
          <select value={form.audience_tag ?? ''} onChange={e => update({ audience_tag: e.target.value })} disabled={locked}>
            {audiences.map(a => (
              <option key={a.tag || 'all'} value={a.tag}>{a.label} ({a.count})</option>
            ))}
          </select>
        </label>

        <label className="mail-field">
          <span>Diseño</span>
          <select value={form.template} onChange={e => update({ template: e.target.value as 'personal' | 'marca' })} disabled={locked}>
            <option value="personal">Personal: como un correo escrito a mano (recomendado para contactos fríos)</option>
            <option value="marca">Con marca: cabecera con logo (para quien ya te conoce)</option>
          </select>
        </label>

        <label className="mail-check">
          <input type="checkbox" checked={form.exclude_replied} onChange={e => update({ exclude_replied: e.target.checked })} disabled={locked} />
          <span>No enviar a quienes ya respondieron (etiqueta <code>respondio</code>)</span>
        </label>

        <fieldset className="mail-field mail-seq" disabled={locked}>
          <span>Secuencia</span>
          <small>Si marcas correos aquí, este solo sale a quien recibió alguno de ellos hace al menos los días indicados. Déjalo vacío si es un primer correo.</small>
          <div className="mail-seq-list">
            {otherCampaigns.map(o => (
              <label key={o.id} className="mail-check">
                <input
                  type="checkbox"
                  checked={form.after_campaigns.includes(o.id)}
                  onChange={e => update({ after_campaigns: e.target.checked ? [...form.after_campaigns, o.id] : form.after_campaigns.filter(x => x !== o.id) })}
                />
                <span>{o.name}</span>
              </label>
            ))}
          </div>
          {form.after_campaigns.length > 0 && (
            <label className="mail-inline-form">
              <span>Esperar</span>
              <input type="number" min={0} max={60} value={form.wait_days} onChange={e => update({ wait_days: Number(e.target.value) })} style={{ width: 80 }} />
              <span>días desde ese correo</span>
            </label>
          )}
        </fieldset>

        <div className="mail-field">
          <span>Contenido</span>
          {!locked && (
            <div className="mail-toolbar" role="toolbar" aria-label="Formato">
              <button type="button" onClick={() => insert('**', '**', 'texto en negrita')}><b>N</b></button>
              <button type="button" onClick={() => insert('==', '==', 'dato clave')} title="Texto en naranja y negrita">Resaltar</button>
              <button type="button" onClick={() => insert('\n\n[[DATOS: ', ' | atletas ; $460 | en premios ; 3 | jueces por atleta]]\n\n', '40')} title="Franja de cifras grandes">Cifras</button>
              <button type="button" onClick={() => insert('[', '](https://)', 'texto del enlace')}>Enlace</button>
              <button type="button" onClick={() => insert('\n\n[[', '|https://endurance.fortisworkout.org]]\n\n', 'Texto del botón')}>Botón</button>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? 'Subiendo…' : 'Imagen'}</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onImage(f); }} />
              <button type="button" onClick={() => insert('\n\n# ', '\n\n', 'Título')}>Título</button>
              <button type="button" onClick={() => insert('\n\n- ', '\n- \n\n', 'Elemento')}>Lista</button>
              <span className="mail-toolbar-sep" />
              <button type="button" onClick={() => insert('{{nombre}}')}>Nombre</button>
              <button type="button" onClick={() => insert('{{empresa|tu marca}}')}>Empresa</button>
            </div>
          )}
          {pendingPhoto && (
            <p className="mail-photo-note">
              Este correo tiene una <strong>foto pendiente</strong> (la línea <code>[FOTO: …]</code>). Pon el cursor en esa línea y usa el botón <strong>Imagen</strong>, o bórrala si no vas a usar foto. No se puede enviar mientras esté.
            </p>
          )}
          <textarea ref={bodyRef} value={form.body} onChange={e => update({ body: e.target.value })} rows={22} disabled={locked} />
          <small>
            Deja una línea en blanco entre párrafos. <code>**negrita**</code>, <code>==resaltado naranja==</code>. La firma con el logo se agrega sola. Usa como máximo una imagen por correo, y ninguna en el primer correo a contactos fríos. <code>{'{{nombre}}'}</code> y <code>{'{{empresa|tu marca}}'}</code> se reemplazan por los datos de cada contacto (lo que va después de la barra se usa si el dato está vacío).
          </small>
        </div>

        {notice && <p className={notice.type === 'ok' ? 'mail-ok' : 'mail-err'}>{notice.text}</p>}

        {!locked && (
          <div className="mail-editor-actions">
            <button type="button" className="mail-btn" onClick={onSave} disabled={saving || !dirty}>
              {saving ? 'Guardando…' : dirty ? 'Guardar cambios' : 'Guardado'}
            </button>
          </div>
        )}

        <div className="mail-card mail-card-inner">
          <h3>Enviar prueba</h3>
          <div className="mail-inline-form">
            <input type="email" placeholder="tu@correo.com" value={testTo} onChange={e => setTestTo(e.target.value)} />
            <button type="button" className="mail-btn" onClick={onTest} disabled={!testTo}>Enviar prueba</button>
          </div>
          <small className="mail-muted">La prueba usa datos de ejemplo (María Pérez, Suplementos del Lago).</small>
        </div>

        <div className="mail-card mail-card-inner">
          <h3>Envío</h3>
          <p className="mail-muted">
            Audiencia: <strong>{audience?.label}</strong> · {audience?.count ?? 0} suscritos · ya enviados: {sentCount}
            {failedCount > 0 && ` · fallidos: ${failedCount}`}
          </p>
          {progress && (
            <div className="mail-progress" aria-label="Progreso del envío">
              <span style={{ width: `${progress.total ? Math.min(100, (progress.sent / progress.total) * 100) : 0}%` }} />
            </div>
          )}
          {status === 'sent' && (
            <p className="mail-ok">Enviada a todos los que cumplían las condiciones{campaign.sent_at ? ` (${new Date(campaign.sent_at).toLocaleString('es-VE')})` : ''}. Si agregas contactos nuevos, puedes enviarles desde aquí.</p>
          )}
          <label className="mail-inline-form">
            <span>Máximo en este envío</span>
            <input type="number" min={1} max={1000} value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ width: 90 }} disabled={sending} />
          </label>
          <small className="mail-muted">Dominio nuevo: semana 1, 30 al día · semana 2, 60 · semana 3 en adelante, 100. Mandar de golpe a cientos de contactos fríos te manda a spam.</small>
          <button type="button" className="mail-btn mail-btn-primary" onClick={onSend} disabled={sending}>
            {sending ? `Enviando… ${progress?.sent ?? 0}/${progress?.total ?? 0}` : status === 'draft' ? 'Enviar campaña' : 'Continuar envío'}
          </button>
        </div>
      </div>

      <div className="mail-editor-preview">
        <div className="mail-preview-bar">
          <div className="mail-preview-meta">
            <strong>{personalize(form.subject, SAMPLE) || '(sin asunto)'}</strong>
            <span>{personalize(form.preheader, SAMPLE)}</span>
          </div>
          <div className="mail-seg">
            <button type="button" className={device === 'desktop' ? 'is-active' : ''} onClick={() => setDevice('desktop')}>Escritorio</button>
            <button type="button" className={device === 'mobile' ? 'is-active' : ''} onClick={() => setDevice('mobile')}>Celular</button>
          </div>
        </div>
        <iframe
          title="Vista previa del correo"
          className={`mail-frame mail-frame-${device}`}
          srcDoc={preview}
          sandbox=""
        />
      </div>
    </div>
  );
}
