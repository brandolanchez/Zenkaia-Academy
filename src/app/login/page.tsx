'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { login } from '@/app/auth/actions';

function LoginForm() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Ingresa a tu cuenta de Zenkai Academy</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form action={login} onSubmit={() => setLoading(true)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input className="form-input" id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input className="form-input" id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          ¿No tienes cuenta? <Link href="/register" className="auth-link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
