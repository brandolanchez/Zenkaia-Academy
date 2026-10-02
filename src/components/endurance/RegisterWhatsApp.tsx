'use client';

import { useState } from 'react';

type Props = { whatsapp: string; edition: string };

// Arma el mensaje de inscripción para WhatsApp: el atleta llena 3 datos,
// toca el botón y solo le falta adjuntar la captura del pago.
export default function RegisterWhatsApp({ whatsapp, edition }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Élite' | 'Alfa Junior' | ''>('');
  const [club, setClub] = useState('');
  const [method, setMethod] = useState<'Pago Móvil' | 'Binance Pay'>('Pago Móvil');
  const [accept, setAccept] = useState(false);
  const [tried, setTried] = useState(false);

  const ready = name.trim().length > 3 && category && accept;

  const message = [
    `INSCRIPCIÓN · Endurance at the Limit ${edition}`,
    `Nombre: ${name.trim()}`,
    `Categoría: ${category}`,
    `Club: ${club.trim() || 'Independiente'}`,
    `Pago: ${method}`,
    'Acepto la exoneración de responsabilidad.',
    '',
    'Te adjunto el comprobante de pago.',
  ].join('\n');

  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="eal-reg-form">
      <div className="eal-reg-grid">
        <label>
          <span>Nombre completo</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Como aparece en tu cédula" autoComplete="name" />
        </label>
        <label>
          <span>Club</span>
          <input value={club} onChange={e => setClub(e.target.value)} placeholder="Ej.: Fortis Workout" />
        </label>
      </div>

      <fieldset className="eal-reg-choice">
        <legend>Categoría</legend>
        {(['Élite', 'Alfa Junior'] as const).map(c => (
          <button type="button" key={c} className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)} aria-pressed={category === c}>
            {c}
          </button>
        ))}
      </fieldset>

      <fieldset className="eal-reg-choice">
        <legend>¿Cómo pagaste?</legend>
        {(['Pago Móvil', 'Binance Pay'] as const).map(m => (
          <button type="button" key={m} className={method === m ? 'is-active' : ''} onClick={() => setMethod(m)} aria-pressed={method === m}>
            {m}
          </button>
        ))}
      </fieldset>

      <label className="eal-reg-accept">
        <input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} />
        <span>
          Leí y acepto la <a href="/exoneracion" target="_blank" rel="noopener noreferrer">exoneración de responsabilidad</a>.
        </span>
      </label>

      {tried && !ready && (
        <p className="eal-reg-error">
          Falta {[!(name.trim().length > 3) && 'tu nombre', !category && 'la categoría', !accept && 'aceptar la exoneración'].filter(Boolean).join(', ')}.
        </p>
      )}

      <a
        href={ready ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="eal-btn eal-btn-whatsapp eal-btn-block eal-btn-lg"
        aria-disabled={!ready}
        onClick={e => { if (!ready) { e.preventDefault(); setTried(true); } }}
      >
        Enviar inscripción por WhatsApp
      </a>
      <p className="eal-pay-note">Se abre WhatsApp con tus datos escritos. Solo adjunta la captura del pago y envía.</p>
    </div>
  );
}
