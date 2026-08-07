'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveUserPayment(paymentId: string, userId: string): Promise<void> {
  const supabase = await createClient();

  // 1. Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status: 'approved' })
    .eq('id', paymentId);

  if (paymentError) throw new Error(paymentError.message);

  // 2. Get the course_id to grant access
  const { data: payment } = await supabase
    .from('payments')
    .select('course_id')
    .eq('id', paymentId)
    .single();

  if (payment?.course_id) {
    await supabase.from('user_courses').insert({
      user_id: userId,
      course_id: payment.course_id,
    });
  }

  // 3. Update global has_paid flag
  await supabase.from('profiles').update({ has_paid: true }).eq('id', userId);

  revalidatePath(`/admin/clients/${userId}`);
  revalidatePath('/admin/clients');
  revalidatePath('/admin');
}

export async function rejectUserPayment(paymentId: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/clients/${userId}`);
  revalidatePath('/admin/clients');
  revalidatePath('/admin');
}

export async function assignUserCourse(userId: string, courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('user_courses').insert({
    user_id: userId,
    course_id: courseId,
  });

  if (error && error.code !== '23505') {
    return { error: error.message };
  }

  revalidatePath(`/admin/clients/${userId}`);
  revalidatePath('/admin/clients');
  return { success: true };
}

export async function removeUserCourse(userId: string, courseId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_courses')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/clients/${userId}`);
  revalidatePath('/admin/clients');
  return { success: true };
}
