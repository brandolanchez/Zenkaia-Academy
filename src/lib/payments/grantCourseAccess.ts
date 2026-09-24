import type { SupabaseClient } from '@supabase/supabase-js';

// Da acceso al alumno cuando se aprueba un pago.
// - Si el pago trae course_id (checkout abierto desde una ruta), da acceso a esa ruta.
// - Si no trae (checkout abierto desde los planes de la landing), da acceso a todas las rutas,
//   porque el plan compra el programa completo.
export async function grantCourseAccess(supabase: SupabaseClient, paymentId: string, userId: string) {
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('course_id')
    .eq('id', paymentId)
    .single();

  if (paymentError) throw new Error(paymentError.message);

  let courseIds: string[];
  if (payment?.course_id) {
    courseIds = [payment.course_id];
  } else {
    const { data: courses, error: coursesError } = await supabase.from('courses').select('id');
    if (coursesError) throw new Error(coursesError.message);
    courseIds = (courses || []).map((c) => c.id);
  }

  if (courseIds.length === 0) return;

  const { error } = await supabase
    .from('user_courses')
    .upsert(
      courseIds.map((course_id) => ({ user_id: userId, course_id })),
      { onConflict: 'user_id,course_id', ignoreDuplicates: true }
    );

  if (error) throw new Error(`Pago aprobado, pero no se pudo dar acceso a la ruta: ${error.message}`);
}
