import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Baja con un clic (encabezado List-Unsubscribe-Post de Gmail y Outlook).
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('t');
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
  const supabase = createAdminClient();
  await supabase.from('email_contacts').update({ status: 'unsubscribed', updated_at: new Date().toISOString() }).eq('unsubscribe_token', token);
  return NextResponse.json({ ok: true });
}
