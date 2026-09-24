'use client';

import { useEffect, useState } from 'react';

// Barra fija inferior (solo móvil): aparece al pasar el hero y se oculta
// cuando la sección de planes o el CTA final ya están en pantalla.
export default function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const targets = document.querySelectorAll('#planes, .cta-section, .footer');
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setTargetVisible(visible.size > 0);
    });
    targets.forEach(t => observer.observe(t));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const show = pastHero && !targetVisible;

  return (
    <div className={`mobile-sticky-cta ${show ? 'is-visible' : ''}`} aria-hidden={!show}>
      <span className="mobile-sticky-cta-text">Desde <strong>$47/mes</strong> · Sin contratos</span>
      <a href="#planes" className="btn btn-primary mobile-sticky-cta-btn" tabIndex={show ? 0 : -1}>
        Ver planes
      </a>
    </div>
  );
}
