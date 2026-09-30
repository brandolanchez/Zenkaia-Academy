'use client';

import { useEffect, useRef } from 'react';

// Video del hero: silenciado, en bucle y sin controles.
// Si la persona pidió reducir movimiento en su sistema, se queda en la imagen de portada.
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      video.removeAttribute('autoplay');
    }
  }, []);

  return (
    <div className="eal-hero-media" aria-hidden>
      <video
        ref={ref}
        className="eal-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/endurance/hero-poster.jpg"
      >
        <source src="/videos/endurance-hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
