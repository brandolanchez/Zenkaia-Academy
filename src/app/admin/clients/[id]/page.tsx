import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Shield, User, Calendar, Mail, Phone, CreditCard, BookOpen, Star } from 'lucide-react';
import { approveUserPayment, rejectUserPayment, assignUserCourse, removeUserCourse } from './actions';
import ProofViewer from '@/components/ProofViewer';

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const supabase = await createClient();

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return (
      <div>
        <Link href="/admin/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={18} /> Volver a Alumnos
        </Link>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--accent-color)' }}>Usuario no encontrado.</p>
        </div>
      </div>
    );
  }

  // Fetch user payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Fetch all courses & user's course assignments
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('title', { ascending: true });

  const { data: userCourses } = await supabase
    .from('user_courses')
    .select('*')
    .eq('user_id', userId);

  // Fetch user reviews
  const { data: reviews } = await supabase
    .from('course_reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      courses(title)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Generate signed URLs for payment proofs
  const paymentsWithUrls = await Promise.all(
    (payments || []).map(async (payment: any) => {
      if (payment.proof_url) {
        const { data } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(payment.proof_url, 3600); // 1 hour
        return { ...payment, signed_proof_url: data?.signedUrl || null };
      }
      return { ...payment, signed_proof_url: null };
    })
  );

  const hasCourse = (courseId: string) => {
    return (userCourses || []).some((uc: any) => uc.course_id === courseId);
  };

  // Extract plan info from the most recent payment
  const latestPayment = paymentsWithUrls.length > 0 ? paymentsWithUrls[0] : null;
  const planInfo = latestPayment ? parsePlanInfo(latestPayment.method) : null;

  return (
    <div>
      {/* Back navigation */}
      <Link href="/admin/clients" className="profile-back-link">
        <ArrowLeft size={18} /> Volver a Alumnos
      </Link>

      {/* Profile Header */}
      <div className="user-profile-header">
        <div className="user-profile-avatar-large">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="Avatar" className="user-profile-avatar-img" />
          ) : (
            <span className="user-profile-avatar-initial">
              {profile.full_name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="user-profile-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>{profile.full_name}</h1>
            {profile.role === 'admin' && (
              <span className="status-badge status-badge-admin">
                <Shield size={12} /> ADMIN
              </span>
            )}
            {profile.has_paid && (
              <span className="status-badge status-badge-approved">PAGADO</span>
            )}
          </div>
          <div className="user-profile-meta">
            <span><Mail size={14} /> {profile.email || 'Sin correo'}</span>
            <span><Phone size={14} /> {profile.phone ? `WhatsApp: ${profile.phone}` : 'Sin teléfono'}</span>
            <span><Calendar size={14} /> Registrado: {new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(profile.created_at))}</span>
            {profile.age && <span><User size={14} /> {profile.age} años</span>}
            {profile.gender && <span>Género: {profile.gender}</span>}
          </div>
          {planInfo && (
            <div style={{ marginTop: '1rem' }}>
              <span className={`status-badge ${planInfo.plan === 'elite' ? 'status-badge-elite' : 'status-badge-standard'}`}>
                {planInfo.plan === 'elite' ? '⚡ PLAN ELITE — $97' : '🏋️ PLAN STANDARD — $47'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="user-profile-grid">

        {/* Payments Section */}
        <div className="user-profile-section">
          <h2 className="user-profile-section-title">
            <CreditCard size={20} /> Historial de Pagos
          </h2>

          {paymentsWithUrls.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No ha realizado ningún pago.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="user-profile-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Plan / Método</th>
                    <th>Estado</th>
                    <th>Comprobante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsWithUrls.map((payment: any) => {
                    const info = parsePlanInfo(payment.method);
                    return (
                      <tr key={payment.id}>
                        <td>
                          {new Intl.DateTimeFormat('es-ES', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          }).format(new Date(payment.created_at))}
                        </td>
                        <td>
                          <div>
                            <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              {info?.methodLabel || payment.method}
                            </span>
                            {info?.plan && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                Plan {info.plan === 'elite' ? 'Elite — $97' : 'Standard — $47'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-badge-${payment.status}`}>
                            {payment.status === 'approved' ? 'Aprobado' : payment.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          {payment.signed_proof_url ? (
                            <ProofViewer proofUrl={payment.signed_proof_url} />
                          ) : (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sin comprobante</span>
                          )}
                        </td>
                        <td>
                          {payment.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <form action={async () => {
                                'use server';
                                await approveUserPayment(payment.id, userId);
                              }}>
                                <button type="submit" className="profile-action-btn profile-action-approve" title="Aprobar">
                                  ✓ Aprobar
                                </button>
                              </form>
                              <form action={async () => {
                                'use server';
                                await rejectUserPayment(payment.id, userId);
                              }}>
                                <button type="submit" className="profile-action-btn profile-action-reject" title="Rechazar">
                                  ✕ Rechazar
                                </button>
                              </form>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="user-profile-section">
          <h2 className="user-profile-section-title">
            <BookOpen size={20} /> Cursos Asignados
          </h2>

          {!courses || courses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No hay cursos disponibles.</p>
          ) : (
            <div className="user-profile-courses-list">
              {courses.map((course: any) => {
                const assigned = hasCourse(course.id);
                return (
                  <div key={course.id} className="user-profile-course-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: assigned ? '#00ff66' : 'var(--text-secondary)',
                        flexShrink: 0
                      }} />
                      <span style={{ fontWeight: assigned ? 600 : 400 }}>{course.title}</span>
                    </div>
                    {assigned ? (
                      <form action={async () => {
                        'use server';
                        await removeUserCourse(userId, course.id);
                      }}>
                        <button type="submit" className="profile-action-btn profile-action-reject" style={{ fontSize: '0.8rem' }}>
                          Quitar Acceso
                        </button>
                      </form>
                    ) : (
                      <form action={async () => {
                        'use server';
                        await assignUserCourse(userId, course.id);
                      }}>
                        <button type="submit" className="profile-action-btn profile-action-approve" style={{ fontSize: '0.8rem' }}>
                          Dar Acceso
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="user-profile-section">
            <h2 className="user-profile-section-title">
              <Star size={20} /> Reseñas
            </h2>
            <div className="user-profile-reviews-list">
              {reviews.map((review: any) => (
                <div key={review.id} className="user-profile-review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>{review.courses?.title || 'Curso'}</strong>
                    <div style={{ color: '#ffd700' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                    {new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(review.created_at))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Parse method string like "crypto-standard" or "zinli-elite" into structured info */
function parsePlanInfo(method: string): { method: string; plan: string | null; methodLabel: string } | null {
  if (!method) return null;
  const parts = method.split('-');
  if (parts.length >= 2) {
    const paymentMethod = parts[0]; // crypto or zinli
    const plan = parts.slice(1).join('-'); // standard or elite
    return {
      method: paymentMethod,
      plan,
      methodLabel: paymentMethod === 'crypto' ? 'Crypto USDT' : paymentMethod === 'zinli' ? 'Zinli' : paymentMethod,
    };
  }
  return { method, plan: null, methodLabel: method };
}
