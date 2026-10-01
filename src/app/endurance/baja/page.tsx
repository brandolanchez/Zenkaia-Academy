import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Darme de baja · Endurance at the Limit', robots: { index: false } };

async function unsubscribe(formData: FormData) {
  'use server';
  const token = String(formData.get('t') || '');
  if (!/^[0-9a-f-]{36}$/i.test(token)) return;
  const supabase = createAdminClient();
  await supabase.from('email_contacts').update({ status: 'unsubscribed', updated_at: new Date().toISOString() }).eq('unsubscribe_token', token);
  revalidatePath('/endurance/baja');
}

export default async function BajaPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const valid = !!t && /^[0-9a-f-]{36}$/i.test(t);
  let status: string | null = null;
  let email: string | null = null;
  if (valid) {
    const supabase = createAdminClient();
    const { data } = await supabase.from('email_contacts').select('email, status').eq('unsubscribe_token', t).maybeSingle();
    status = data?.status ?? null;
    email = data?.email ?? null;
  }

  return (
    <main className="eal-section">
      <div className="eal-container" style={{ maxWidth: 560 }}>
        <p className="eal-eyebrow">Correos</p>
        {!valid || !status ? (
          <>
            <h1 className="eal-display eal-h2">Enlace no válido</h1>
            <p className="eal-intro">No encontramos tu suscripción. Si quieres dejar de recibir correos, responde cualquiera de nuestros mensajes con la palabra “baja”.</p>
          </>
        ) : status === 'unsubscribed' ? (
          <>
            <h1 className="eal-display eal-h2">Listo, te dimos de baja</h1>
            <p className="eal-intro">{email} ya no recibirá correos de Endurance at the Limit.</p>
          </>
        ) : (
          <>
            <h1 className="eal-display eal-h2">¿Dejar de recibir correos?</h1>
            <p className="eal-intro">Vamos a dejar de escribir a {email}.</p>
            <form action={unsubscribe}>
              <input type="hidden" name="t" value={t} />
              <button type="submit" className="eal-btn eal-btn-primary">Darme de baja</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
