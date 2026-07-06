import { createClient } from '@/lib/supabase/server';
import { assignCourse, removeCourse } from './actions';
import Image from 'next/image';

export default async function AdminClientsPage() {
  const supabase = await createClient();

  // Obtener todos los perfiles, los cursos disponibles y las asignaciones
  const { data: clients, error: clientsError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('title', { ascending: true });

  const { data: userCourses, error: userCoursesError } = await supabase
    .from('user_courses')
    .select('*');

  if (clientsError || coursesError || userCoursesError) {
    return <div className="error-message">Error al cargar datos.</div>;
  }

  // Helper para saber si un usuario tiene un curso asignado
  const hasCourse = (userId: string, courseId: string) => {
    return userCourses.some(uc => uc.user_id === userId && uc.course_id === courseId);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Gestión de Alumnos</h1>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '2rem' }}>Todos los usuarios registrados</h2>
        
        {(!clients || clients.length === 0) ? (
          <p style={{ color: 'var(--text-secondary)' }}>No hay usuarios registrados aún.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Usuario</th>
                  <th style={{ padding: '1rem' }}>Email / Contacto</th>
                  <th style={{ padding: '1rem' }}>Asignar Rutas</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client: any) => (
                  <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {client.avatar_url ? (
                          <Image src={client.avatar_url} alt="Avatar" width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} unoptimized />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {client.full_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{client.full_name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {client.role === 'admin' && <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>ADMIN</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      <div>{client.email || 'Sin correo'}</div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        {client.phone ? `WhatsApp: ${client.phone}` : 'Sin teléfono'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {courses.map((course: any) => {
                          const assigned = hasCourse(client.id, course.id);
                          return (
                            <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.9rem', minWidth: '150px' }}>{course.title}</span>
                              {assigned ? (
                                <form action={async () => {
                                  'use server';
                                  await removeCourse(client.id, course.id);
                                }}>
                                  <button type="submit" className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderColor: '#ff3366', color: '#ff3366' }}>
                                    Quitar Acceso
                                  </button>
                                </form>
                              ) : (
                                <form action={async () => {
                                  'use server';
                                  await assignCourse(client.id, course.id);
                                }}>
                                  <button type="submit" className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderColor: '#00ff66', color: '#00ff66' }}>
                                    Dar Acceso
                                  </button>
                                </form>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
