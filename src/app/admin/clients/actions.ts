'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function assignCourse(user_id: string, course_id: string) {
  const supabase = await createClient();
  
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
  const supabase = await createClient();
  
  const { error } = await supabase.from('user_courses').delete()
    .eq('user_id', user_id)
    .eq('course_id', course_id);

  if (error) return { error: error.message };

  revalidatePath('/admin/clients');
  return { success: true };
}
