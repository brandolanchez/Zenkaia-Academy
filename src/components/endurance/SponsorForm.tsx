'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function SponsorForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/endurance/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'No se pudo enviar. Intenta de nuevo.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'No se pudo enviar. Intenta de nuevo.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="eal-form eal-form-done" role="status">
        <h3 className="eal-h3">Recibimos tu mensaje</h3>
        <p className="eal-body">Te respondemos al correo que nos dejaste con la propuesta de patrocinio.</p>
      </div>
    );
  }

  return (
    <form className="eal-form" onSubmit={onSubmit} noValidate={false}>
      <div className="eal-field-row">
        <label className="eal-field">
          <span>Nombre</span>
          <input name="name" required autoComplete="name" maxLength={100} />
        </label>
        <label className="eal-field">
          <span>Empresa o marca</span>
          <input name="company" required autoComplete="organization" maxLength={120} />
        </label>
      </div>
      <div className="eal-field-row">
        <label className="eal-field">
          <span>Correo</span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
        <label className="eal-field">
          <span>Teléfono (opcional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label className="eal-field">
        <span>¿Qué te interesa? (opcional)</span>
        <textarea name="message" rows={4} maxLength={2000} placeholder="Ej.: visibilidad de marca, activación en el evento, aportar premios…" />
      </label>

      {/* Campo trampa para bots: las personas no lo ven */}
      <input name="website" tabIndex={-1} autoComplete="off" className="eal-hp" aria-hidden />

      {error && <p className="eal-form-error" role="alert">{error}</p>}

      <button type="submit" className="eal-btn eal-btn-primary eal-btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Quiero recibir la propuesta'}
      </button>
    </form>
  );
}
