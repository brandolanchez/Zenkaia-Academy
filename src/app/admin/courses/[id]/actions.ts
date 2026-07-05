'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addVideo(formData: FormData) {
  const supabase = await createClient();
  const course_id = formData.get('course_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const video_url = formData.get('video_url') as string;
  const is_free = formData.get('is_free') === 'on';
  const order = parseInt(formData.get('order') as string || '1');

  if (!title || !video_url || !course_id) {
    return { error: 'Faltan campos obligatorios.' };
  }

  const { error } = await supabase.from('videos').insert({
    course_id,
    title,
    description,
    video_url,
    is_free,
    order
  });

  if (error) return { error: error.message };

  revalidatePath(`/admin/courses/${course_id}`);
  return { success: true };
}

export async function deleteVideo(id: string, course_id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('videos').delete().eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath(`/admin/courses/${course_id}`);
  return { success: true };
}

export async function updateVideo(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const course_id = formData.get('course_id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const video_url = formData.get('video_url') as string;
  const is_free = formData.get('is_free') === 'on';
  const order = parseInt(formData.get('order') as string || '1');

  if (!id || !title || !video_url || !course_id) {
    return { error: 'Faltan campos obligatorios.' };
  }

  const { error } = await supabase.from('videos').update({
    title,
    description,
    video_url,
    is_free,
    order
  }).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/courses/${course_id}`);
  return { success: true };
}
