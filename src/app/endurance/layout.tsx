import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './endurance.css';

// Tipografía display: Anton (licencia OFL), condensada y pesada como las letras del logo.
// Reemplazo temporal de "Nocturna Giorgia": cuando tengas el archivo .woff2,
// ponlo en ./fonts/ y cambia el `src` de abajo por esa ruta.
const display = localFont({
  src: './fonts/anton-latin-400-normal.woff2',
  weight: '400',
  display: 'swap',
  variable: '--eal-display-font',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://endurance.fortisworkout.org'),
  title: 'Endurance at the Limit · 2ª Edición | Competencia de calistenia en el Zulia',
  description:
    'Competencia de resistencia en calistenia del Estado Zulia. Clasificación por circuitos, top 16 a eliminación directa y título estatal. Inscripción $20. Abierta a patrocinadores.',
  openGraph: {
    title: 'Endurance at the Limit · 2ª Edición',
    description: 'Competencia de resistencia en calistenia del Estado Zulia. Inscripciones y patrocinios abiertos.',
    url: 'https://endurance.fortisworkout.org',
    type: 'website',
  },
};

export default function EnduranceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`eal ${display.variable}`}>{children}</div>;
}
