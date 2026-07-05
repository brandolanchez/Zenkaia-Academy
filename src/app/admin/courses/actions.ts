'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const thumbnailFile = formData.get('thumbnail') as File;

  if (!title) return { error: 'El título es obligatorio.' };

  let thumbnail_url = null;

  // Subir miniatura si se proporcionó
  if (thumbnailFile && thumbnailFile.size > 0) {
    const fileExt = thumbnailFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, thumbnailFile, {
        contentType: thumbnailFile.type,
        upsert: false
      });

    if (uploadError) return { error: `Error subiendo imagen: ${uploadError.message}` };

    const { data: { publicUrl } } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    thumbnail_url = publicUrl;
  }

  const { error } = await supabase.from('courses').insert({
    title,
    description,
    thumbnail_url
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/courses');
  return { success: true };
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('courses').delete().eq('id', id);
  
  if (error) return { error: error.message };
  
  revalidatePath('/admin/courses');
  return { success: true };
}

export async function updateCourse(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const thumbnailFile = formData.get('thumbnail') as File;

  if (!id || !title) return { error: 'El título es obligatorio.' };

  let thumbnail_url = null;

  // Subir miniatura si se proporcionó
  if (thumbnailFile && thumbnailFile.size > 0) {
    const fileExt = thumbnailFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, thumbnailFile, {
        contentType: thumbnailFile.type,
        upsert: false
      });

    if (uploadError) return { error: `Error subiendo imagen: ${uploadError.message}` };

    const { data: { publicUrl } } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    thumbnail_url = publicUrl;
  }

  const updateData: any = { title, description };
  if (thumbnail_url) {
    updateData.thumbnail_url = thumbnail_url;
  }

  const { error } = await supabase.from('courses').update(updateData).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/courses/${id}`);
  revalidatePath('/admin/courses');
  return { success: true };
}
