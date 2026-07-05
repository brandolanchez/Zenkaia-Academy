'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { signup } from '@/app/auth/actions';

function RegisterForm() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Únete a Zenkai</h1>
        <p className="auth-subtitle">Crea tu cuenta para empezar tu transformación</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form action={signup} onSubmit={() => setLoading(true)}>
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">Nombre Completo</label>
            <input className="form-input" id="full_name" name="full_name" type="text" required placeholder="Ej: Brando Lanchez" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input className="form-input" id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="age">Edad</label>
              <input className="form-input" id="age" name="age" type="number" min={12} max={100} required placeholder="25" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="gender">Género</label>
              <select className="form-select" id="gender" name="gender" required>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input className="form-input" id="password" name="password" type="password" required placeholder="••••••••" minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Completar Registro'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes cuenta? <Link href="/login" className="auth-link">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
