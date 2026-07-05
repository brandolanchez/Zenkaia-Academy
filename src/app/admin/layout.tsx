import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { LayoutDashboard, Users, BookOpen, CreditCard } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard/profile')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      
      <div className="admin-layout-container">
        {/* Admin Sidebar */}
        <aside className="admin-sidebar-mobile">
          <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
            Panel Admin
          </h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/admin" className="admin-nav-link">
              <CreditCard size={18} /> Pagos
            </Link>
            <Link href="/admin/courses" className="admin-nav-link">
              <BookOpen size={18} /> Rutas Zenkai
            </Link>
            <Link href="/admin/clients" className="admin-nav-link">
              <Users size={18} /> Alumnos
            </Link>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="admin-main-content">
          {children}
        </main>
      </div>

      <style>{`
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .admin-nav-link:hover {
          background: rgba(255, 0, 60, 0.1);
          color: var(--accent-color);
        }
      `}</style>
    </div>
  )
}
