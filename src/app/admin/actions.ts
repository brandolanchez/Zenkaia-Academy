'use server';

import { requireAdmin } from '@/lib/auth/requireAdmin';
import { revalidatePath } from 'next/cache';
import { grantCourseAccess } from '@/lib/payments/grantCourseAccess';

export async function approvePayment(paymentId: string, userId: string): Promise<void> {
  const { supabase } = await requireAdmin();

  // 1. Update payment status
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status: 'approved' })
    .eq('id', paymentId);

  if (paymentError) throw new Error(paymentError.message);

  await grantCourseAccess(supabase, paymentId, userId);

  // 2. Update user profile to has_paid = true
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ has_paid: true })
    .eq('id', userId);

  if (profileError) throw new Error(profileError.message);

  revalidatePath('/admin');
}

export async function rejectPayment(paymentId: string): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId);

  if (error) throw new Error(error.message);

  revalidatePath('/admin');
}

