'use client';

import { useCallback, useEffect, useState } from 'react';

type Photo = { key: string; alt: string; w: number; h: number; layout?: 'big' | 'wide' | 'tall' };
type Edition = { title: string; note: string; photos: Photo[] };

const BASE = '/images/endurance/ediciones';

// Fotos reales de las ediciones anteriores (versiones de 640 y 1280 px en BASE)
const EDITIONS: Edition[] = [
  {
    title: '1ª edición',
    note: '30 atletas · al aire libre',
    photos: [
      { key: 'ed1-escenario', alt: 'Atletas compitiendo en las barras con el público alrededor', w: 1280, h: 960, layout: 'big' },
      { key: 'ed1-grupo', alt: 'Foto grupal de los atletas', w: 1280, h: 720, layout: 'wide' },
      { key: 'ed1-atleta', alt: 'Atleta en la barra durante la competencia, con el público mirando', w: 1280, h: 960 },
      { key: 'ed1-barras', alt: 'Zona de barras al aire libre', w: 1280, h: 720 },
    ],
  },
  {
    title: '2ª edición',
    note: 'Bajo techo',
    photos: [
      { key: 'ed2-podio', alt: 'Podio con los ganadores y sus premios', w: 1280, h: 720, layout: 'big' },
      { key: 'ed2-atletas', alt: 'Dos atletas en anillas y barra durante la competencia', w: 720, h: 1280, layout: 'tall' },
      { key: 'ed2-trofeos', alt: 'Trofeos de los ganadores', w: 1280, h: 1280 },
      { key: 'ed2-calentamiento', alt: 'Calentamiento de los atletas antes de competir', w: 1280, h: 720 },
    ],
  },
];

const ALL = EDITIONS.flatMap(e => e.photos.map(p => ({ ...p, edition: e.title })));
// Posición de la primera foto de cada edición dentro de ALL (para el visor)
const OFFSETS = EDITIONS.map((_, i) => EDITIONS.slice(0, i).reduce((n, e) => n + e.photos.length, 0));

export default function PastEditions() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen(i => (i === null ? i : (i + d + ALL.length) % ALL.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, move]);

  const current = open !== null ? ALL[open] : null;

  return (
    <>
      <div className="eal-past-groups">
        {EDITIONS.map((ed, ei) => (
          <div key={ed.title} className="eal-past-group">
            <div className="eal-past-head">
              <h3 className="eal-display">{ed.title}</h3>
              <span>{ed.note}</span>
            </div>
            <div className="eal-past-grid">
              {ed.photos.map((p, pi) => {
                const i = OFFSETS[ei] + pi;
                return (
                  <button
                    key={p.key}
                    type="button"
                    className={`eal-past-item${p.layout ? ` is-${p.layout}` : ''}`}
                    onClick={() => setOpen(i)}
                    aria-label={`Ampliar foto: ${p.alt}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE}/${p.key}-640.webp`}
                      srcSet={`${BASE}/${p.key}-640.webp 640w, ${BASE}/${p.key}-1280.webp 1280w`}
                      sizes={p.layout === 'big' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
                      alt={p.alt}
                      width={p.w}
                      height={p.h}
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div className="eal-lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/${current.key}-1280.webp`}
            alt={`${current.alt} (${current.edition})`}
            width={current.w}
            height={current.h}
            onClick={e => e.stopPropagation()}
          />
          <p className="eal-lightbox-caption">{current.edition} · {current.alt}</p>
          <button type="button" className="eal-lightbox-close" onClick={close} aria-label="Cerrar">×</button>
          <button type="button" className="eal-lightbox-nav is-prev" onClick={e => { e.stopPropagation(); move(-1); }} aria-label="Foto anterior">‹</button>
          <button type="button" className="eal-lightbox-nav is-next" onClick={e => { e.stopPropagation(); move(1); }} aria-label="Foto siguiente">›</button>
        </div>
      )}
    </>
  );
}
