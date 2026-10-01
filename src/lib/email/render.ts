import { PUBLIC_SITE_URL } from './config';

// ─────────────────────────────────────────────────────────────
// Formato del cuerpo del correo (simple, pensado para escribir rápido):
//   párrafos separados por una línea en blanco
//   **negrita**            ==resaltado naranja==      [texto](https://enlace)
//   # Título               - elemento de lista
//   [[DATOS: 40 | atletas ; $460 | en premios ; 3 | jueces]]   → franja de cifras
//   [[Texto del botón|https://enlace]]   → botón naranja
//   ![descripción](https://imagen.jpg)    → imagen (sola en su párrafo)
//   [FOTO: indicación]                    → recordatorio de foto pendiente (bloquea el envío)
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

// Paleta y tipografía alineadas con endurance.fortisworkout.org
const C = {
  ink: '#11161b',
  text: '#1d262e',
  muted: '#5b646b',
  faint: '#7a8288',
  line: '#e3e6e8',
  orange: '#e25a2a',
  tint: '#fff4ef',
};
// Anton es la tipografía del sitio. Gmail no carga fuentes web: usa Impact,
// que tiene el mismo aire condensado. Apple Mail, iOS y Outlook.com sí cargan Anton.
const DISPLAY = "'Anton', Impact, 'Arial Narrow Bold', 'Arial Black', sans-serif";
const BODY = "'Outfit', Arial, Helvetica, sans-serif";

function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/\*\*(.+?)\*\*/g, `<strong style="font-weight:700;color:${C.ink};">$1</strong>`);
  out = out.replace(/==(.+?)==/g, `<span style="font-weight:700;color:${C.orange};">$1</span>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
    `<a href="${esc(safeUrl(u))}" style="color:${C.orange};font-weight:700;text-decoration:underline;">${t}</a>`);
  return out;
}

const PHOTO_RE = /^\[FOTO:\s*([^\]]*)\]$/i;
const IMG_RE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const DATA_RE = /^\[\[DATOS:\s*(.+)\]\]$/i;

// ¿El cuerpo tiene alguna foto pendiente por subir?
export function hasPhotoPlaceholder(body: string): boolean {
  return body.split('\n').some(l => PHOTO_RE.test(l.trim()));
}

const parseData = (raw: string) =>
  raw.split(';').map(item => {
    const [value, ...label] = item.split('|');
    return { value: (value || '').trim(), label: label.join('|').trim() };
  }).filter(d => d.value).slice(0, 4);

const P = `margin:0 0 18px;font-family:${BODY};font-size:16px;line-height:1.65;color:${C.text};`;

export function bodyToHtml(body: string): string {
  const blocks = body.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
  return blocks
    .map(block => {
      const lines = block.split('\n');
      const trimmed = block.trim();

      const img = trimmed.match(IMG_RE);
      if (img) {
        const src = /^https:\/\//i.test(img[2]) ? img[2] : '';
        if (!src) return '';
        return `<img src="${esc(src)}" alt="${esc(img[1])}" width="536" style="display:block;width:100%;max-width:536px;height:auto;border:0;margin:6px 0 22px;">`;
      }

      const photo = trimmed.match(PHOTO_RE);
      if (photo) {
        return `<div style="margin:6px 0 22px;padding:28px 20px;border:2px dashed ${C.orange};background:${C.tint};text-align:center;font-family:${BODY};font-size:14px;line-height:1.5;color:#a8401c;"><strong>FOTO PENDIENTE</strong><br>${esc(photo[1])}</div>`;
      }

      // Franja de cifras: números grandes en la tipografía del evento
      const data = trimmed.match(DATA_RE);
      if (data) {
        const items = parseData(data[1]);
        const w = Math.floor(100 / Math.max(1, items.length));
        const cells = items.map((d, i) =>
          `<td width="${w}%" align="center" valign="top" style="padding:16px 8px;${i > 0 ? `border-left:1px solid ${C.line};` : ''}">
<div style="font-family:${DISPLAY};font-size:32px;line-height:1.1;color:${C.orange};letter-spacing:0.5px;">${esc(d.value)}</div>
<div style="font-family:${BODY};font-size:12px;line-height:1.4;color:${C.muted};text-transform:uppercase;letter-spacing:1px;padding-top:4px;">${esc(d.label)}</div>
</td>`).join('');
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;border-top:3px solid ${C.orange};background:#f6f7f8;"><tr>${cells}</tr></table>`;
      }

      const btn = trimmed.match(/^\[\[([^|\]]+)\|([^\]]+)\]\]$/);
      if (btn) {
        return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 26px;"><tr><td style="background:${C.orange};">
<a href="${esc(safeUrl(btn[2]))}" style="display:inline-block;padding:14px 26px;font-family:${DISPLAY};font-size:16px;letter-spacing:1.5px;text-transform:uppercase;color:#140a05;text-decoration:none;">${esc(btn[1].trim())}</a>
</td></tr></table>`;
      }

      // Lista: viñeta cuadrada naranja (se ve igual en todos los clientes de correo)
      if (lines.every(l => /^\s*[-•]\s+/.test(l))) {
        const rows = lines.map(l =>
          `<tr><td width="18" valign="top" style="padding:10px 0 0;"><div style="width:7px;height:7px;background:${C.orange};font-size:0;line-height:0;">&nbsp;</div></td><td valign="top" style="padding:0 0 10px;font-family:${BODY};font-size:16px;line-height:1.6;color:${C.text};">${inline(l.replace(/^\s*[-•]\s+/, ''))}</td></tr>`).join('');
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;">${rows}</table>`;
      }

      if (lines.length === 1 && /^#\s+/.test(lines[0])) {
        return `<h2 style="margin:10px 0 14px;font-family:${DISPLAY};font-weight:400;font-size:28px;line-height:1.15;letter-spacing:0.5px;text-transform:uppercase;color:${C.ink};">${inline(lines[0].replace(/^#\s+/, ''))}</h2>`;
      }
      return `<p style="${P}">${lines.map(inline).join('<br>')}</p>`;
    })
    .join('\n');
}

export function bodyToText(body: string): string {
  return body
    .replace(/^!\[[^\]]*\]\([^)\s]+\)\s*$/gm, '')
    .replace(/^\[FOTO:[^\]]*\]\s*$/gim, '')
    .replace(/^\[\[DATOS:\s*(.+)\]\]\s*$/gim, (_, raw: string) => parseData(raw).map(d => `${d.value} ${d.label}`).join(' · '))
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$1: $2')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1 ($2)')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/==(.+?)==/g, '$1')
    .replace(/^#\s+/gm, '');
}

// Firma: se agrega sola al final de cada correo, con el logo del evento
const SIGNATURE = {
  name: 'Brando Lanchez',
  role: 'Organizador · Endurance at the Limit',
  whatsapp: '0412-613-4013',
  whatsappUrl: 'https://wa.me/584126134013',
  instagram: '@fortisworkout',
  instagramUrl: 'https://www.instagram.com/fortisworkout/',
};

function signatureHtml(): string {
  const a = `color:${C.orange};font-weight:700;text-decoration:none;`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 4px;">
<tr>
<td valign="middle" style="padding:0 16px 0 0;"><a href="${PUBLIC_SITE_URL}" style="text-decoration:none;"><img src="${PUBLIC_SITE_URL}/images/endurance/logo-email-light.png" width="76" alt="Endurance at the Limit" style="display:block;border:0;width:76px;height:auto;"></a></td>
<td valign="middle" style="padding:2px 0 2px 16px;border-left:3px solid ${C.orange};font-family:${BODY};">
<div style="font-size:16px;line-height:1.3;font-weight:700;color:${C.ink};">${SIGNATURE.name}</div>
<div style="font-size:13px;line-height:1.5;color:${C.muted};">${SIGNATURE.role}</div>
<div style="font-size:13px;line-height:1.6;padding-top:4px;"><a href="${SIGNATURE.whatsappUrl}" style="${a}">WhatsApp ${SIGNATURE.whatsapp}</a> <span style="color:${C.line};">|</span> <a href="${SIGNATURE.instagramUrl}" style="${a}">${SIGNATURE.instagram}</a></div>
<div style="font-size:13px;line-height:1.5;"><a href="${PUBLIC_SITE_URL}" style="color:${C.muted};text-decoration:none;">endurance.fortisworkout.org</a></div>
</td>
</tr>
</table>`;
}

const signatureText = () =>
  `${SIGNATURE.name}\n${SIGNATURE.role}\nWhatsApp ${SIGNATURE.whatsapp} · Instagram ${SIGNATURE.instagram}\nendurance.fortisworkout.org`;

export type EmailTemplate = 'personal' | 'marca';

const HEAD = `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title></title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
</head>`;

// personal: fondo blanco, sin cabecera; el logo va en la firma. Parece escrito
//           a mano y es el que mejor llega a la bandeja principal en frío.
// marca:    cabecera oscura con el logo grande y la edición. Para quien ya te conoce.
export function renderEmail(opts: {
  body: string;
  preheader?: string;
  recipient: Recipient;
  unsubscribeUrl?: string;
  template?: EmailTemplate;
  signature?: boolean;
}): { html: string; text: string } {
  const body = personalize(opts.body, opts.recipient);
  const preheader = personalize(opts.preheader || '', opts.recipient);
  const withSignature = opts.signature !== false;
  const unsub = opts.unsubscribeUrl
    ? `<a href="${esc(opts.unsubscribeUrl)}" style="color:${C.faint};text-decoration:underline;">Darme de baja</a>`
    : '';
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>`
    : '';
  const sig = withSignature ? signatureHtml() : '';

  const html = opts.template === 'marca'
    ? `<!doctype html>
<html lang="es">${HEAD}
<body style="margin:0;padding:0;background:#eef0f2;">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
<tr><td align="center" style="background:${C.ink};padding:28px 32px 22px;border-bottom:4px solid ${C.orange};">
<a href="${PUBLIC_SITE_URL}" style="text-decoration:none;"><img src="${PUBLIC_SITE_URL}/images/endurance/logo-email.png" width="132" alt="Endurance at the Limit" style="display:block;border:0;width:132px;height:auto;margin:0 auto;"></a>
<div style="font-family:${DISPLAY};font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#ffffff;padding-top:14px;">3ª Edición · Maracaibo, Zulia</div>
</td></tr>
<tr><td style="padding:34px 32px 18px;">
${bodyToHtml(body)}
${sig}
</td></tr>
<tr><td style="padding:18px 32px 26px;background:#f6f7f8;font-family:${BODY};font-size:12px;line-height:1.6;color:${C.faint};">
Endurance at the Limit · Competencia de resistencia en calistenia · Maracaibo, Zulia<br>
<a href="${PUBLIC_SITE_URL}" style="color:${C.faint};">endurance.fortisworkout.org</a>${unsub ? ' · ' + unsub : ''}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
    : `<!doctype html>
<html lang="es">${HEAD}
<body style="margin:0;padding:0;background:#ffffff;">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
<tr><td style="padding:24px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td>
${bodyToHtml(body)}
${sig}
</td></tr>
<tr><td style="padding:22px 0 0;font-family:${BODY};font-size:12px;line-height:1.5;color:${C.faint};">
Endurance at the Limit · Maracaibo, Zulia${unsub ? ' · ' + unsub : ''}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const text = `${bodyToText(body)}${withSignature ? `\n\n${signatureText()}` : ''}${
    opts.unsubscribeUrl ? `\n\n—\nDarme de baja: ${opts.unsubscribeUrl}` : ''
  }`;

  return { html, text };
}

export function unsubscribeUrl(token: string) {
  return `${PUBLIC_SITE_URL}/baja?t=${encodeURIComponent(token)}`;
}

export function oneClickUnsubscribeUrl(token: string) {
  return `${PUBLIC_SITE_URL}/api/email/unsubscribe?t=${encodeURIComponent(token)}`;
}
