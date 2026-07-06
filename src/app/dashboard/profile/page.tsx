import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AvatarUpload from '@/components/AvatarUpload'
import LogoutButton from '@/components/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '5rem', minHeight: '100vh' }}>
        <h1 className="section-title text-left">Mi Perfil</h1>
        
        <div className="responsive-grid-1-2">
          {/* Tarjeta de Información del Usuario */}
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <AvatarUpload userId={user.id} avatarUrl={profile?.avatar_url} />

              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{profile?.full_name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <p><strong>Edad:</strong> {profile?.age || 'N/A'}</p>
              <p><strong>Género:</strong> {profile?.gender || 'N/A'}</p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Estado:</strong>{' '}
                {profile?.has_paid ? (
                  <span style={{ color: '#00ff66' }}>Suscripción Activa</span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Gratuito</span>
                )}
              </p>
            </div>
            
            {profile?.role === 'admin' && (
              <div style={{ marginTop: '2rem' }}>
                <Link href="/admin" className="btn btn-outline" style={{ width: '100%', padding: '0.8rem' }}>
                  Panel de Administrador
                </Link>
              </div>
            )}

            <div style={{ marginTop: profile?.role === 'admin' ? '1rem' : '2rem' }}>
              <LogoutButton style={{ width: '100%', padding: '0.8rem', borderColor: '#ff3366', color: '#ff3366' }} />
            </div>
          </div>

          {/* Tarjeta de Rutas */}
          <div className="card">
            <h2 className="card-title">Mis Rutas Zenkai</h2>
            <p style={{ marginBottom: '2rem' }}>Continúa tu entrenamiento donde lo dejaste.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Zenkai Mentorship Program</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aprende las bases de la calistenia y entrenamiento funcional.</p>
              </div>
              <Link href="/curso/zenkai-mentorship" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                Ir a mi Ruta
              </Link>
            </div>

            {!profile?.has_paid && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 0, 60, 0.1)', borderLeft: '4px solid var(--accent-color)' }}>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>¡Desbloquea tu Ruta completa!</h3>
                <p style={{ marginBottom: '1rem' }}>Solo tienes acceso a los videos introductorios. Sube de nivel y desbloquea el programa completo eligiendo tu plan de mentoría.</p>
                <Link href="/#planes" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
                  Ver planes disponibles
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
