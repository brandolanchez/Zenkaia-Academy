import { EMAIL_FROM } from './config';

export type OutgoingEmail = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  headers?: Record<string, string>;
};

const API = 'https://api.resend.com';

function key() {
  const k = process.env.RESEND_API_KEY;
  if (!k) throw new Error('Falta configurar RESEND_API_KEY.');
  return k;
}

export async function sendEmail(email: OutgoingEmail): Promise<{ id: string }> {
  const res = await fetch(`${API}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: EMAIL_FROM, ...email, to: [email.to] }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `Resend respondió ${res.status}`);
  return { id: data.id };
}

// Hasta 100 correos por llamada.
export async function sendBatch(emails: OutgoingEmail[]): Promise<{ ids: (string | null)[]; error?: string }> {
  const res = await fetch(`${API}/emails/batch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(emails.map(e => ({ from: EMAIL_FROM, ...e, to: [e.to] }))),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ids: emails.map(() => null), error: data?.message || `Resend respondió ${res.status}` };
  const list: { id: string }[] = data?.data || [];
  return { ids: emails.map((_, i) => list[i]?.id ?? null) };
}

export async function getReceivedEmail(id: string) {
  const res = await fetch(`${API}/emails/receiving/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  if (!res.ok) throw new Error(`No se pudo leer el correo recibido (${res.status})`);
  return res.json() as Promise<{
    id: string;
    from: string;
    to: string[];
    subject: string;
    html: string | null;
    text: string | null;
    message_id?: string;
    created_at: string;
  }>;
}
