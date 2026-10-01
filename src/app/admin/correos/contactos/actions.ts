'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export type ImportRow = { email: string; name?: string; company?: string; phone?: string; tags?: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanTags = (tags: string[]) =>
  Array.from(new Set(tags.map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean)));

// Importa o actualiza contactos. Nunca reactiva a quien se dio de baja.
export async function importContacts(rows: ImportRow[], extraTags: string[]) {
  const { supabase } = await requireAdmin();
  const extra = cleanTags(extraTags);

  const valid = new Map<string, ImportRow>();
  let invalid = 0;
  for (const r of rows) {
    const email = (r.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) { invalid++; continue; }
    valid.set(email, { ...r, email });
  }
  const emails = [...valid.keys()];
  if (emails.length === 0) return { inserted: 0, updated: 0, invalid };

  // Contactos que ya existen (en tandas para no exceder el tamaño de la consulta)
  const existing = new Map<string, { id: string; tags: string[] }>();
  for (let i = 0; i < emails.length; i += 200) {
    const chunk = emails.slice(i, i + 200);
    const { data, error } = await supabase.from('email_contacts').select('id, email, tags').in('email', chunk);
    if (error) throw new Error(error.message);
    data?.forEach(c => existing.set(c.email.toLowerCase(), { id: c.id, tags: c.tags || [] }));
  }

  const toInsert = [];
  let updated = 0;
  for (const [email, r] of valid) {
    const tags = cleanTags([...(r.tags || []), ...extra]);
    const prev = existing.get(email);
    if (prev) {
      const patch: Record<string, unknown> = { tags: cleanTags([...prev.tags, ...tags]), updated_at: new Date().toISOString() };
      if (r.name) patch.name = r.name.trim();
      if (r.company) patch.company = r.company.trim();
      if (r.phone) patch.phone = r.phone.trim();
      const { error } = await supabase.from('email_contacts').update(patch).eq('id', prev.id);
      if (!error) updated++;
    } else {
      toInsert.push({
        email,
        name: r.name?.trim() || null,
        company: r.company?.trim() || null,
        phone: r.phone?.trim() || null,
        tags,
        source: 'importacion',
      });
    }
  }

  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += 500) {
    const chunk = toInsert.slice(i, i + 500);
    const { error } = await supabase.from('email_contacts').insert(chunk);
    if (error) throw new Error(error.message);
    inserted += chunk.length;
  }

  revalidatePath('/admin/correos/contactos');
  return { inserted, updated, invalid };
}

export async function addContact(formData: FormData) {
  const { supabase } = await requireAdmin();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new Error('Correo inválido.');
  const tags = cleanTags(String(formData.get('tags') || '').split(','));
  const fields = {
    name: String(formData.get('name') || '').trim() || null,
    company: String(formData.get('company') || '').trim() || null,
    phone: String(formData.get('phone') || '').trim() || null,
  };
  const { data: prev } = await supabase.from('email_contacts').select('id, tags').eq('email', email).maybeSingle();
  const { error } = prev
    ? await supabase.from('email_contacts').update({ ...fields, tags: cleanTags([...(prev.tags || []), ...tags]), updated_at: new Date().toISOString() }).eq('id', prev.id)
    : await supabase.from('email_contacts').insert({ email, ...fields, tags, source: 'manual' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/correos/contactos');
}

export async function setContactStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  if (!['subscribed', 'unsubscribed'].includes(status)) return;
  await supabase.from('email_contacts').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/admin/correos/contactos');
}

export async function deleteContact(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('email_contacts').delete().eq('id', String(formData.get('id')));
  revalidatePath('/admin/correos/contactos');
}
