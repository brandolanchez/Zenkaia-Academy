'use client';

import { useEffect, useState } from 'react';

// CTA fijo en móvil: aparece al pasar el hero y se esconde en la sección de inscripción y en el cierre.
export default function StickyCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hidden = new Set<Element>();
    const targets = document.querySelectorAll('.eal-hero, #inscripcion, .eal-final, .eal-footer');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? hidden.add(e.target) : hidden.delete(e.target)));
      setShow(hidden.size === 0);
    });
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <a href="#inscripcion" className={`eal-mobile-cta ${show ? 'is-visible' : ''}`} aria-hidden={!show} tabIndex={show ? 0 : -1}>
      {label}
    </a>
  );
}
