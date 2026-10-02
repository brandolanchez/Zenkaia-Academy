'use client';

import { useEffect, useState } from 'react';

// Cuenta regresiva. Solo aparece cuando hay fecha confirmada (EVENT.dateISO en page.tsx).
export default function Countdown({ dateISO }: { dateISO: string | null }) {
  const target = dateISO ? Date.parse(dateISO) : NaN;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [target]);

  if (Number.isNaN(target) || now === null || target <= now) return null;

  const diff = target - now;
  const parts = [
    { v: Math.floor(diff / 86_400_000), l: 'días' },
    { v: Math.floor((diff % 86_400_000) / 3_600_000), l: 'horas' },
    { v: Math.floor((diff % 3_600_000) / 60_000), l: 'minutos' },
  ];

  return (
    <div className="eal-countdown" role="timer" aria-label={`Faltan ${parts[0].v} días`}>
      <span className="eal-countdown-label">Faltan</span>
      {parts.map(p => (
        <span key={p.l} className="eal-countdown-part">
          <strong className="eal-display">{String(p.v).padStart(2, '0')}</strong>
          <small>{p.l}</small>
        </span>
      ))}
    </div>
  );
}
