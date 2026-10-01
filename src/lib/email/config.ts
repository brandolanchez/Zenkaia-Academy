// Configuración de correo. Variables de entorno en Netlify:
//   RESEND_API_KEY          clave de Resend
//   EMAIL_FROM              remitente, ej. "Endurance at the Limit <patrocinios@fortisworkout.org>"
//   RESEND_WEBHOOK_SECRET   secreto del webhook de correos recibidos (whsec_...)
//   EMAIL_FORWARD_TO        (opcional) reenvía cada mensaje nuevo de la bandeja a este correo
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Endurance at the Limit <patrocinios@fortisworkout.org>';
export const PUBLIC_SITE_URL = process.env.ENDURANCE_SITE_URL || 'https://endurance.fortisworkout.org';

export function fromAddress(): string {
  const m = EMAIL_FROM.match(/<([^>]+)>/);
  return (m ? m[1] : EMAIL_FROM).trim();
}
