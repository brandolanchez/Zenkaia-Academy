import { createClient } from '@/lib/supabase/server';

// Las server actions se pueden invocar con un POST directo desde cualquier ruta,
// así que el middleware de /admin no las protege. Cada acción de admin debe
// llamar a esta función antes de hacer nada.
export async function requireAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('No autorizado.');

  return { supabase, user };
}
