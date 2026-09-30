import type { Metadata } from 'next';
import { Bodoni_Moda } from 'next/font/google';
import './endurance.css';

// Tipografía de títulos. Reemplazo temporal de "Nocturna Giorgia":
// cuando tengas el archivo, ponlo en /public/fonts y cambia esta carga por next/font/local
// (ver instrucciones en endurance.css, variable --eal-display).
const display = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  style: ['normal', 'italic'],
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
