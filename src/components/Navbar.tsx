'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', session.user.id)
          .single();
        setProfile(data || { full_name: session.user.email });
      }
    };

    getSession();
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image 
            src="/images/images/logo 2.svg" 
            alt="Zenkai Academy" 
            width={160} 
            height={45} 
            priority
            className="logo-desktop"
          />
          <Image 
            src="/images/images/Logo 1.svg" 
            alt="Zenkai Academy" 
            width={120} 
            height={35} 
            priority
            className="logo-mobile"
          />
          <span style={{ fontSize: '0.65rem', fontWeight: 400, letterSpacing: '12px', color: 'var(--text-secondary)', marginTop: '0.1rem', marginRight: '-12px' }}>
            ACADEMY
          </span>
        </div>
      </Link>
      
      {profile ? (
        <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '0.9rem', display: 'none' }} className="nav-username">{profile.full_name?.split(' ')[0]}</span>
          {profile.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt="Avatar" 
              width={40} 
              height={40} 
              style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              unoptimized
            />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="white" />
            </div>
          )}
        </Link>
      ) : (
        <Link href="/register" className="nav-cta">
          Únete Ahora
        </Link>
      )}
      
      <style jsx>{`
        @media (min-width: 768px) {
          .nav-username { display: inline !important; }
        }
      `}</style>
    </nav>
  );
}
