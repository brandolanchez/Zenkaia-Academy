import type { Metadata } from 'next';

// Página de acceso: no tiene valor en Google, así que no se indexa.
export const metadata: Metadata = {
  title: 'Iniciar sesión | Zenkai Academy',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
