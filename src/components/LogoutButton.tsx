'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ className = "btn btn-outline", style = {} }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className={className} style={{ ...style, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
      <LogOut size={18} /> Cerrar Sesión
    </button>
  );
}
