import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AvatarUpload from '@/components/AvatarUpload'
import LogoutButton from '@/components/LogoutButton'
import { Lock, PlayCircle, Clock, AlertCircle, ShieldCheck } from 'lucide-react'

type Course = { id: string; title: string; description: string | null; thumbnail_url: string | null }
type VideoRow = { course_id: string }
type Payment = { status: 'pending' | 'approved' | 'rejected'; method: string; created_at: string }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'long' })
}

function planFromMethod(method?: string) {
  if (!method) return null
  return method.includes('elite') ? 'Élite' : 'Standard'
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: coursesData }, { data: ownedData }, { data: paymentsData }] = await Promise.all([
    supabase.from('profiles').select('full_name, avatar_url, role').eq('id', user.id).single(),
    supabase.from('courses').select('id, title, description, thumbnail_url').order('created_at', { ascending: true }),
    supabase.from('user_courses').select('course_id').eq('user_id', user.id),
    supabase.from('payments').select('status, method, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
  ])

  // El alumno solo ve las rutas que el admin le habilitó
  const owned = new Set((ownedData || []).map((r: { course_id: string }) => r.course_id))
  const courses = ((coursesData || []) as Course[]).filter(c => owned.has(c.id))

  // Conteo de clases por ruta habilitada
  const { data: videoRows } = owned.size > 0
    ? await supabase.from('videos').select('course_id').in('course_id', [...owned])
    : { data: [] as VideoRow[] }
  const videos = (videoRows || []) as VideoRow[]
  const latestPayment = (paymentsData?.[0] || null) as Payment | null

  const hasAccess = owned.size > 0
  const isPending = latestPayment?.status === 'pending'
  const isRejected = !hasAccess && latestPayment?.status === 'rejected'
  const plan = hasAccess && latestPayment?.status === 'approved' ? planFromMethod(latestPayment.method) : null
  const firstName = profile?.full_name?.split(' ')[0] || ''

  const countFor = (courseId: string) => videos.filter(v => v.course_id === courseId).length

  return (
    <>
      <Navbar />
      <div className="container dash">
        <header className="dash-header">
          <h1 className="dash-title">Hola{firstName ? `, ${firstName}` : ''}</h1>
          <p className="dash-subtitle">
            {hasAccess ? 'Elige una ruta y entrena.' : 'Aún no tienes rutas habilitadas.'}
          </p>
        </header>

        {/* Estado de acceso: un solo mensaje, según el momento del alumno */}
        {isPending && (
          <div className="dash-notice dash-notice-pending" role="status">
            <Clock size={22} />
            <div>
              <strong>Estamos revisando tu comprobante</strong>
              <p>Lo enviaste el {formatDate(latestPayment!.created_at)}. Cuando lo aprobemos, tus rutas aparecerán aquí. No necesitas pagar de nuevo.</p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="dash-notice dash-notice-rejected" role="alert">
            <AlertCircle size={22} />
            <div>
              <strong>No pudimos validar tu comprobante</strong>
              <p>Revisa que el monto y la referencia coincidan y envíalo otra vez.</p>
              <Link href="/checkout" className="btn btn-primary dash-btn">Enviar nuevo comprobante</Link>
            </div>
          </div>
        )}

        {!hasAccess && !isPending && !isRejected && (
          <div className="dash-notice dash-notice-unlock">
            <Lock size={22} />
            <div>
              <strong>Activa tu programa</strong>
              <p>Elige tu plan y envía el comprobante. Cuando lo aprobemos, tus rutas aparecerán aquí.</p>
              <div className="dash-actions">
                <Link href="/checkout" className="btn btn-primary dash-btn">Elegir plan y pagar</Link>
                <Link href="/#planes" className="dash-link">Comparar planes</Link>
              </div>
            </div>
          </div>
        )}

        <div className="dash-grid">
          {/* Contenido principal: las rutas */}
          <section aria-labelledby="mis-rutas">
            <h2 id="mis-rutas" className="dash-section-title">Mis rutas</h2>

            {courses.length === 0 ? (
              <div className="dash-empty">
                {isPending ? 'Tus rutas aparecerán aquí cuando aprobemos tu pago.' : 'Todavía no tienes rutas habilitadas.'}
              </div>
            ) : (
              <ul className="dash-courses">
                {courses.map(course => {
                  const total = countFor(course.id)
                  return (
                    <li key={course.id} className="dash-course">
                      <Link href={`/curso/${course.id}`} className="dash-course-thumb" aria-hidden tabIndex={-1}>
                        {course.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={course.thumbnail_url} alt="" loading="lazy" />
                        ) : (
                          <PlayCircle size={32} />
                        )}
                      </Link>

                      <div className="dash-course-body">
                        {total > 0 && (
                          <div className="dash-course-meta">
                            <span className="dash-course-count">{total} {total === 1 ? 'clase' : 'clases'}</span>
                          </div>
                        )}
                        <h3 className="dash-course-title">{course.title}</h3>
                        {course.description && <p className="dash-course-desc">{course.description}</p>}
                      </div>

                      <Link href={`/curso/${course.id}`} className="btn btn-primary dash-btn">
                        Entrar
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {/* Cuenta: secundario */}
          <aside className="dash-account" aria-label="Mi cuenta">
            <AvatarUpload userId={user.id} avatarUrl={profile?.avatar_url ?? null} />
            <h2 className="dash-account-name">{profile?.full_name}</h2>
            <p className="dash-account-email">{user.email}</p>

            <div className="dash-account-plan">
              {hasAccess ? (
                <span className="status-badge status-badge-approved"><ShieldCheck size={14} /> {plan ? `Plan ${plan}` : 'Acceso activo'}</span>
              ) : isPending ? (
                <span className="status-badge status-badge-pending"><Clock size={14} /> Pago en revisión</span>
              ) : (
                <span className="status-badge dash-badge-locked">Sin plan activo</span>
              )}
            </div>

            <div className="dash-account-actions">
              {profile?.role === 'admin' && (
                <Link href="/admin" className="btn btn-outline dash-btn dash-btn-full">Panel de administrador</Link>
              )}
              <LogoutButton className="dash-logout" />
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .dash { padding-top: 140px; padding-bottom: 5rem; min-height: 100vh; }
        .dash-header { margin-bottom: 2rem; }
        .dash-title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -1px; }
        .dash-subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-top: 0.5rem; }

        .dash-notice { display: flex; gap: 1rem; align-items: flex-start; padding: 1.25rem 1.5rem; margin-bottom: 2rem; border-left: 4px solid; background: var(--glass-bg); }
        .dash-notice strong { display: block; font-size: 1.05rem; margin-bottom: 0.25rem; }
        .dash-notice p { color: var(--text-secondary); margin-bottom: 0; }
        .dash-notice svg { flex-shrink: 0; margin-top: 2px; }
        .dash-notice .dash-btn { margin-top: 1rem; }
        .dash-notice-pending { border-color: #ffd700; background: rgba(255, 215, 0, 0.06); }
        .dash-notice-pending svg { color: #ffd700; }
        .dash-notice-rejected { border-color: #ff3366; background: rgba(255, 0, 60, 0.08); }
        .dash-notice-rejected svg { color: #ff3366; }
        .dash-notice-unlock { border-color: var(--accent-color); background: rgba(255, 0, 60, 0.08); }
        .dash-notice-unlock svg { color: var(--accent-color); }
        .dash-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; margin-top: 1rem; }
        .dash-actions .dash-btn { margin-top: 0; }
        .dash-link { color: var(--text-primary); text-decoration: underline; text-underline-offset: 4px; font-weight: 600; }
        .dash-link:hover { color: var(--accent-color); }

        .dash-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 2rem; align-items: start; }
        .dash-section-title { font-size: 1.1rem; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 1rem; }

        .dash-courses { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .dash-course { display: grid; grid-template-columns: 120px minmax(0, 1fr) auto; gap: 1.25rem; align-items: center; padding: 1rem; border: 1px solid var(--border-color); background: var(--glass-bg); transition: border-color 0.2s; }
        .dash-course:hover { border-color: rgba(255, 0, 60, 0.4); }
        .dash-course-thumb { width: 120px; aspect-ratio: 16 / 9; background: var(--bg-secondary); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); overflow: hidden; }
        .dash-course-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .dash-course-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
        .dash-course-count { color: var(--text-secondary); font-size: 0.85rem; }
        .dash-course-title { font-size: 1.15rem; text-transform: none; font-weight: 700; line-height: 1.3; }
        .dash-course-desc { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .dash-badge-locked { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); border: 1px solid var(--border-color); }

        .dash-btn { padding: 0.8rem 1.5rem; font-size: 0.85rem; white-space: nowrap; }
        .dash-btn-full { width: 100%; }
        .dash-empty { padding: 2rem; border: 1px dashed var(--border-color); color: var(--text-secondary); text-align: center; }

        .dash-account { border: 1px solid var(--border-color); background: var(--glass-bg); padding: 2rem 1.5rem; text-align: center; }
        .dash-account-name { font-size: 1.2rem; text-transform: none; font-weight: 700; margin-top: 0.5rem; }
        .dash-account-email { color: var(--text-secondary); font-size: 0.9rem; word-break: break-all; }
        .dash-account-plan { margin: 1rem 0 1.5rem; }
        .dash-account-actions { display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem; }
        .dash-logout { background: none; border: none; color: var(--text-secondary); font: inherit; font-size: 0.9rem; cursor: pointer; padding: 0.5rem; }
        .dash-logout:hover { color: #ff3366; }

        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .dash { padding-top: 120px; }
          .dash-course { grid-template-columns: 88px minmax(0, 1fr); }
          .dash-course-thumb { width: 88px; }
          .dash-course > .dash-btn { grid-column: 1 / -1; width: 100%; }
          .dash-notice { padding: 1rem; }
          .dash-actions .dash-btn { width: 100%; }
        }
      `}</style>
    </>
  )
}
