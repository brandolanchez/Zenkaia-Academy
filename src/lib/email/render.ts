import { PUBLIC_SITE_URL } from './config';

// ─────────────────────────────────────────────────────────────
// Formato del cuerpo del correo (simple, pensado para escribir rápido):
//   párrafos separados por una línea en blanco
//   **negrita**            [texto](https://enlace)
//   # Título               - elemento de lista
//   [[Texto del botón|https://enlace]]   → botón naranja
// Variables: {{nombre}}, {{empresa}}, {{email}}, con valor por defecto: {{empresa|tu marca}}
// ─────────────────────────────────────────────────────────────

export type Recipient = { name?: string | null; company?: string | null; email: string };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const safeUrl = (u: string) => (/^(https?:|mailto:)/i.test(u.trim()) ? u.trim() : '#');

export function personalize(text: string, r: Recipient): string {
  const firstName = (r.name || '').trim().split(/\s+/)[0] || '';
  const vars: Record<string, string> = {
    nombre: firstName,
    nombre_completo: (r.name || '').trim(),
    empresa: (r.company || '').trim(),
    email: r.email,
  };
  return text
    .replace(/\{\{\s*(\w+)\s*(?:\|([^}]*))?\}\}/g, (_, key: string, def?: string) => {
      const v = vars[key.toLowerCase()];
      return v ? v : (def ?? '').trim();
    })
    .replace(/[ \t]+,/g, ','); // "Hola ," → "Hola,"
}

function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
    `<a href="${esc(safeUrl(u))}" style="color:#e25a2a;text-decoration:underline;">${t}</a>`);
  return out;
}

const P = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#1d262e;';

export function bodyToHtml(body: string): string {
  const blocks = body.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
  return blocks
    .map(block => {
      const lines = block.split('\n');
      const btn = block.trim().match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
      if (btn) {
        return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:#e25a2a;">
<a href="${esc(safeUrl(btn[2]))}" style="display:inline-block;padding:14px 26px;font-weight:800;font-size:14px;letter-spacing:1px;text-transform:uppercase;color:#140a05;text-decoration:none;">${esc(btn[1].trim())}</a>
</td></tr></table>`;
      }
      if (lines.every(l => /^\s*[-•]\s+/.test(l))) {
        const items = lines.map(l => `<li style="margin:0 0 6px;">${inline(l.replace(/^\s*[-•]\s+/, ''))}</li>`).join('');
        return `<ul style="margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.6;color:#1d262e;">${items}</ul>`;
      }
      if (lines.length === 1 && /^#\s+/.test(lines[0])) {
        return `<h2 style="margin:8px 0 14px;font-size:22px;line-height:1.25;color:#11161b;">${inline(lines[0].replace(/^#\s+/, ''))}</h2>`;
      }
      return `<p style="${P}">${lines.map(inline).join('<br>')}</p>`;
    })
    .join('\n');
}

export function bodyToText(body: string): string {
  return body
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$1: $2')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1 ($2)')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#\s+/gm, '');
}

export function renderEmail(opts: {
  body: string;
  preheader?: string;
  recipient: Recipient;
  unsubscribeUrl?: string;
}): { html: string; text: string } {
  const body = personalize(opts.body, opts.recipient);
  const preheader = personalize(opts.preheader || '', opts.recipient);
  const unsub = opts.unsubscribeUrl
    ? `<a href="${esc(opts.unsubscribeUrl)}" style="color:#7a8288;text-decoration:underline;">Darme de baja</a>`
    : '';

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title></head>
<body style="margin:0;padding:0;background:#eef0f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="background:#11161b;padding:22px 32px;border-bottom:4px solid #e25a2a;">
<a href="${PUBLIC_SITE_URL}" style="text-decoration:none;"><img src="${PUBLIC_SITE_URL}/images/endurance/logo-email.png" width="120" alt="Endurance at the Limit" style="display:block;border:0;height:auto;"></a>
</td></tr>
<tr><td style="padding:32px 32px 16px;">
${bodyToHtml(body)}
</td></tr>
<tr><td style="padding:18px 32px 26px;border-top:1px solid #e3e6e8;font-size:12px;line-height:1.5;color:#7a8288;">
Endurance at the Limit · 3ª Edición · Maracaibo, Zulia<br>
<a href="${PUBLIC_SITE_URL}" style="color:#7a8288;">endurance.fortisworkout.org</a>${unsub ? ' · ' + unsub : ''}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const text = `${bodyToText(body)}\n\n—\nEndurance at the Limit · endurance.fortisworkout.org${
    opts.unsubscribeUrl ? `\nDarme de baja: ${opts.unsubscribeUrl}` : ''
  }`;

  return { html, text };
}

export function unsubscribeUrl(token: string) {
  return `${PUBLIC_SITE_URL}/baja?t=${encodeURIComponent(token)}`;
}

export function oneClickUnsubscribeUrl(token: string) {
  return `${PUBLIC_SITE_URL}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}
