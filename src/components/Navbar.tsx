'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ lineHeight: 1, marginRight: '-4px' }}>ZENKAI</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 300, letterSpacing: '14px', color: 'var(--text-secondary)', marginTop: '0.2rem', marginRight: '-14px' }}>
            ACADEMY
          </span>
        </div>
        <span style={{ color: 'var(--accent-color)', marginLeft: '0.8rem', letterSpacing: 'normal' }}>全開</span>
      </div>
      <Link href="#planes" className="nav-cta">
        Únete Ahora
      </Link>
    </nav>
  );
}
