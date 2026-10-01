'use client';

import { useMemo, useRef, useState } from 'react';
import { renderEmail, personalize } from '@/lib/email/render';
import { saveCampaign, sendTest, sendNextBatch, audienceStatus, type CampaignInput } from '../actions';

type Campaign = {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  body: string;
  audience_tag: string | null;
  exclude_replied: boolean;
  status: 'draft' | 'sending' | 'sent';
  sent_at: string | null;
};

type Audience = { tag: string; label: string; count: number };

const SAMPLE = { name: 'María Pérez', company: 'Suplementos del Lago', email: 'maria@ejemplo.com' };

export default function CampaignEditor({
  campaign,
  audiences,
  sentCount,
  failedCount,
}: {
  campaign: Campaign;
  audiences: Audience[];
  sentCount: number;
  failedCount: number;
}) {
  const [form, setForm] = useState<CampaignInput>({
    name: campaign.name,
    subject: campaign.subject,
    preheader: campaign.preheader,
    body: campaign.body,
    audience_tag: campaign.audience_tag ?? '',
    exclude_replied: campaign.exclude_replied ?? true,
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [testTo, setTestTo] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null);
  const [status, setStatus] = useState(campaign.status);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const locked = status === 'sent';
  const audience = audiences.find(a => a.tag === (form.audience_tag || '')) ?? audiences[0];

  const preview = useMemo(
    () => renderEmail({ body: form.body, preheader: form.preheader, recipient: SAMPLE, unsubscribeUrl: '#' }).html,
    [form.body, form.preheader]
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
    const { audience: total, sent } = await audienceStatus(campaign.id);
    const pending = total - sent;
    if (pending <= 0) {
      setNotice({ type: 'err', text: 'No hay contactos pendientes para esta audiencia.' });
      return;
    }
    if (!confirm(`Vas a enviar "${form.subject}" a ${pending} contactos. ¿Continuar?`)) return;

    setSending(true);
    setNotice(null);
    setStatus('sending');
    let done = sent;
    setProgress({ sent: done, total });
    try {
      for (let i = 0; i < 200; i++) {
        const r = await sendNextBatch(campaign.id);
        done += r.sent;
        setProgress({ sent: done, total });
        if (r.remaining === 0) break;
      }
      setStatus('sent');
      setNotice({ type: 'ok', text: `Campaña enviada a ${done} contactos.` });
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

        <label className="mail-check">
          <input type="checkbox" checked={form.exclude_replied} onChange={e => update({ exclude_replied: e.target.checked })} disabled={locked} />
          <span>No enviar a quienes ya respondieron (etiqueta <code>respondio</code>)</span>
        </label>

        <div className="mail-field">
          <span>Contenido</span>
          {!locked && (
            <div className="mail-toolbar" role="toolbar" aria-label="Formato">
              <button type="button" onClick={() => insert('**', '**', 'texto en negrita')}><b>N</b></button>
              <button type="button" onClick={() => insert('[', '](https://)', 'texto del enlace')}>Enlace</button>
              <button type="button" onClick={() => insert('\n\n[[', '|https://endurance.fortisworkout.org]]\n\n', 'Texto del botón')}>Botón</button>
              <button type="button" onClick={() => insert('\n\n# ', '\n\n', 'Título')}>Título</button>
              <button type="button" onClick={() => insert('\n\n- ', '\n- \n\n', 'Elemento')}>Lista</button>
              <span className="mail-toolbar-sep" />
              <button type="button" onClick={() => insert('{{nombre}}')}>Nombre</button>
              <button type="button" onClick={() => insert('{{empresa|tu marca}}')}>Empresa</button>
            </div>
          )}
          <textarea ref={bodyRef} value={form.body} onChange={e => update({ body: e.target.value })} rows={22} disabled={locked} />
          <small>
            Deja una línea en blanco entre párrafos. <code>{'{{nombre}}'}</code> y <code>{'{{empresa|tu marca}}'}</code> se reemplazan por los datos de cada contacto (lo que va después de la barra se usa si el dato está vacío).
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
            Audiencia: <strong>{audience?.label}</strong> · {audience?.count ?? 0} suscritos · ya enviados: {progress?.sent ?? sentCount}
            {failedCount > 0 && ` · fallidos: ${failedCount}`}
          </p>
          {progress && (
            <div className="mail-progress" aria-label="Progreso del envío">
              <span style={{ width: `${progress.total ? Math.min(100, (progress.sent / progress.total) * 100) : 0}%` }} />
            </div>
          )}
          {!locked ? (
            <button type="button" className="mail-btn mail-btn-primary" onClick={onSend} disabled={sending}>
              {sending ? `Enviando… ${progress?.sent ?? 0}/${progress?.total ?? 0}` : status === 'sending' ? 'Continuar envío' : 'Enviar campaña'}
            </button>
          ) : (
            <p className="mail-ok">Campaña enviada{campaign.sent_at ? ` el ${new Date(campaign.sent_at).toLocaleString('es-VE')}` : ''}.</p>
          )}
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
