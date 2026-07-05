import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'
import { PlayCircle, Lock, ArrowLeft, MessageSquare, FileText, Star } from 'lucide-react'

export default async function CursoPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { videoId?: string; tab?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase.from('courses').select('*').eq('id', params.id).single()
  if (!course) return <div style={{ color: 'white', padding: '2rem' }}>Ruta no encontrada</div>

  const { data: userCourse } = await supabase.from('user_courses')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', params.id)
    .single()
    
  const hasPaid = !!userCourse

  const { data: videos } = await supabase.from('videos')
    .select('*')
    .eq('course_id', params.id)
    .order('order', { ascending: true })

  const courseVideos = videos && videos.length > 0 ? videos : [
    { id: '1', title: 'Ruta sin videos', is_free: true, video_url: '', description: 'Esta ruta aún no tiene videos asignados.' }
  ]

  const currentVideoId = searchParams?.videoId || courseVideos[0].id
  const currentTab = searchParams?.tab || 'resumen'
  const currentVideo = courseVideos.find(v => v.id === currentVideoId) || courseVideos[0]

  return (
    <div className="course-player-container">
      
      {/* Sidebar - Lista de Clases (Platzi Style) */}
      <aside className="course-sidebar-mobile">
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/dashboard/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s', marginBottom: '1rem' }} className="hover-white">
            <ArrowLeft size={16} /> Volver al Perfil
          </Link>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 }}>{course.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ background: 'var(--accent-color)', width: '8px', height: '8px', borderRadius: '50%' }}></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{courseVideos.length} Módulos</p>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.5rem 1rem 0.5rem 1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Contenido de la Ruta</h3>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {courseVideos.map((video, index) => {
              const isActive = video.id === currentVideo.id;
              const isLocked = !video.is_free && !hasPaid;
              
              return (
                <li key={video.id}>
                  <Link 
                    href={`/curso/${params.id}?videoId=${video.id}&tab=${currentTab}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      background: isActive ? 'rgba(255, 0, 60, 0.05)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                      textDecoration: 'none',
                      color: isLocked ? 'rgba(255,255,255,0.4)' : (isActive ? '#fff' : 'var(--text-secondary)'),
                      pointerEvents: isLocked ? 'none' : 'auto',
                      transition: 'background 0.2s, color 0.2s'
                    }}
                    className={!isLocked && !isActive ? 'hover-bg-light' : ''}
                  >
                    <div style={{ marginTop: '2px', color: isLocked ? 'rgba(255,255,255,0.2)' : (isActive ? 'var(--accent-color)' : 'var(--text-secondary)') }}>
                      {isLocked ? <Lock size={18} /> : <PlayCircle size={18} />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, lineHeight: 1.4, display: 'block' }}>{video.title}</span>
                      <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block', opacity: 0.7 }}>{index === 0 ? '10 min' : '45 min'}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content - Reproductor y Tabs */}
      <main className="course-main-content">
        
        {/* Video Area */}
        <div style={{ background: '#000', width: '100%', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', aspectRatio: '16/9' }}>
            <VideoPlayer 
              url={currentVideo.video_url} 
              isFree={currentVideo.is_free} 
              hasPaid={hasPaid} 
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="course-content-padding">
          
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>{currentVideo.title}</h1>
          
          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
            <Link 
              href={`/curso/${params.id}?videoId=${currentVideo.id}&tab=resumen`}
              style={{ 
                paddingBottom: '1rem', 
                color: currentTab === 'resumen' ? '#fff' : 'var(--text-secondary)',
                borderBottom: currentTab === 'resumen' ? '2px solid var(--accent-color)' : '2px solid transparent',
                textDecoration: 'none',
                fontWeight: currentTab === 'resumen' ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <FileText size={16} /> Resumen
            </Link>
            <Link 
              href={`/curso/${params.id}?videoId=${currentVideo.id}&tab=comentarios`}
              style={{ 
                paddingBottom: '1rem', 
                color: currentTab === 'comentarios' ? '#fff' : 'var(--text-secondary)',
                borderBottom: currentTab === 'comentarios' ? '2px solid var(--accent-color)' : '2px solid transparent',
                textDecoration: 'none',
                fontWeight: currentTab === 'comentarios' ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <MessageSquare size={16} /> Preguntas y Aportes
            </Link>
          </div>

          {/* Tab Content */}
          <div className="responsive-grid-2-1">
            
            <div style={{ minHeight: '300px' }}>
              {currentTab === 'resumen' && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Acerca de esta clase</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>{currentVideo.description}</p>
                </div>
              )}

              {currentTab === 'comentarios' && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Comunidad Zenkai</h3>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Aún no hay aportes en esta clase. Sé el primero en iniciar la discusión.</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <textarea 
                        placeholder="Escribe tu duda o aporte para la comunidad..." 
                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', minHeight: '100px', resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Publicar</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Cards */}
            <div>
              {!hasPaid ? (
                <div style={{ background: 'linear-gradient(145deg, rgba(255,0,60,0.1) 0%, rgba(10,10,10,1) 100%)', border: '1px solid rgba(255,0,60,0.3)', padding: '2rem', borderRadius: '12px', textAlign: 'center', position: 'sticky', top: '2rem' }}>
                  <Lock size={32} style={{ color: 'var(--accent-color)', margin: '0 auto 1rem' }} />
                  <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Desbloquea tu potencial</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>Obtén acceso inmediato a todos los módulos, rutinas descargables y mentoría 1 a 1 por un único pago de ${course.price}.</p>
                  <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', display: 'block', padding: '1rem' }}>Adquirir Programa Completo</Link>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', position: 'sticky', top: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Valora esta clase</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Tu feedback directo nos ayuda a mejorar el contenido.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', color: '#fbbf24', cursor: 'pointer' }}>
                    <Star size={24} fill="currentColor" />
                    <Star size={24} fill="currentColor" />
                    <Star size={24} fill="currentColor" />
                    <Star size={24} fill="currentColor" />
                    <Star size={24} opacity={0.3} />
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <style>{`
        .hover-white:hover { color: #fff !important; }
        .hover-bg-light:hover { background: rgba(255,255,255,0.02) !important; }
        
        /* Custom scrollbar for sidebar */
        aside::-webkit-scrollbar { width: 6px; }
        aside::-webkit-scrollbar-track { background: transparent; }
        aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        aside::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}
