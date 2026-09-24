'use server';

import { requireAdmin } from '@/lib/auth/requireAdmin';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function assignCourse(user_id: string, course_id: string) {
  const { supabase } = await requireAdmin();
  
  const { error } = await supabase.from('user_courses').insert({
    user_id,
    course_id
  });

  if (error && error.code !== '23505') { // 23505 is unique violation, meaning already assigned
    return { error: error.message };
  }

  revalidatePath('/admin/clients');
  return { success: true };
}

export async function removeCourse(user_id: string, course_id: string) {
  const { supabase } = await requireAdmin();
  
  const { error } = await supabase.from('user_courses').delete()
    .eq('user_id', user_id)
    .eq('course_id', course_id);

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  return { success: true };
}

export async function deleteProfile(user_id: string) {
  await requireAdmin();

  // Para eliminar al usuario completamente (incluyendo credenciales de login)
  // necesitamos usar el Service Role Key que salta el RLS.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY en las variables de entorno' };
  }

  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Eliminar el usuario de auth.users. Esto dispara el ON DELETE CASCADE
  // que eliminará automáticamente su registro en public.profiles, user_courses, etc.
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  return { success: true };
}
