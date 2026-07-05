'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approvePayment(paymentId: string, userId: string): Promise<void> {
  const supabase = await createClient();

  // 1. Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status: 'approved' })
    .eq('id', paymentId);

  if (paymentError) throw new Error(paymentError.message);

  // We should also grant access to the course the user paid for.
  // First, get the payment details
  const { data: payment } = await supabase.from('payments').select('course_id').eq('id', paymentId).single();
  
  if (payment?.course_id) {
    await supabase.from('user_courses').insert({
      user_id: userId,
      course_id: payment.course_id
    });
  }

  // Also update global has_paid for legacy compatibility just in case
  await supabase.from('profiles').update({ has_paid: true }).eq('id', userId);

  // 2. Update user profile to has_paid = true
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ has_paid: true })
    .eq('id', userId);

  if (profileError) throw new Error(profileError.message);

  revalidatePath('/admin');
}

export async function rejectPayment(paymentId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

