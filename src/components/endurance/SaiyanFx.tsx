'use client';

import { useEffect, useState } from 'react';
import { sfx, music } from '@/lib/endurance/audio';

const KEY_SFX = 'eal-sfx';
const KEY_MUSIC = 'eal-music';
const read = (k: string, def: boolean) => {
  try { const v = localStorage.getItem(k); return v === null ? def : v === '1'; } catch { return def; }
};
const save = (k: string, v: boolean) => { try { localStorage.setItem(k, v ? '1' : '0'); } catch { /* sin almacenamiento */ } };

// Efectos de "golpe" al tocar botones, entrada con impacto de los títulos
// y control de música 8-bit. La música nunca arranca sola: el navegador
// lo bloquea y además molesta. Arranca cuando la persona la enciende.
export default function SaiyanFx() {
  const [sound, setSound] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSound(read(KEY_SFX, true)), 0);
    return () => clearTimeout(t);
  }, []);

  // Golpe al tocar botones y enlaces de acción
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.eal .eal-btn, .eal button, .eal .eal-path');
      if (!el || el.closest('.eal-fx-controls')) return;
      const strong = el.matches('.eal-btn-primary, .eal-btn-lg, .eal-btn-whatsapp, .eal-path, .eal-nav-cta');
      if (sound) (strong ? sfx.punch : sfx.tap)();
      if (reduced) return;
      el.classList.remove('is-hit');
      void el.offsetWidth;
      el.classList.add('is-hit');
      if (strong) {
        const burst = document.createElement('span');
        burst.className = 'eal-burst';
        burst.style.left = `${e.clientX}px`;
        burst.style.top = `${e.clientY}px`;
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 600);
        document.documentElement.classList.add('eal-shake');
        setTimeout(() => document.documentElement.classList.remove('eal-shake'), 260);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [sound]);

  // Títulos que entran con impacto al bajar
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = document.querySelectorAll('.eal .eal-h2, .eal .eal-eyebrow');
    items.forEach(i => i.classList.add('eal-fx-in'));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    items.forEach(i => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  // Al salir de la página se apaga la música
  useEffect(() => () => music.stop(), []);

  const toggleMusic = () => {
    if (music.playing) { music.stop(); setPlaying(false); save(KEY_MUSIC, false); }
    else { sfx.powerUp(); setTimeout(() => music.start(), 300); setPlaying(true); save(KEY_MUSIC, true); }
  };
  const toggleSound = () => { const v = !sound; setSound(v); save(KEY_SFX, v); if (v) sfx.tap(); };

  return (
    <div className="eal-fx-controls" role="group" aria-label="Sonido">
      <button type="button" onClick={toggleMusic} className={playing ? 'is-on' : ''} aria-pressed={playing} title={playing ? 'Apagar música' : 'Poner música 8-bit'}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M9 18V6l11-2v12" stroke="currentColor" strokeWidth="2" fillOpacity="0"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="17.5" cy="16" r="2.5" fill="currentColor"/></svg>
        <span>{playing ? 'Música on' : 'Música'}</span>
        {playing && <i className="eal-eq" aria-hidden><b /><b /><b /></i>}
      </button>
      <button type="button" onClick={toggleSound} className={sound ? 'is-on' : ''} aria-pressed={sound} title={sound ? 'Silenciar efectos' : 'Activar efectos'} aria-label={sound ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}>
        {sound ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
      </button>
    </div>
  );
}
