import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './endurance.css';
import SaiyanFx from '@/components/endurance/SaiyanFx';

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
  title: 'Endurance at the Limit · 3ª Edición | Competencia de calistenia en el Zulia',
  description:
    'El reto de resistencia en calistenia del Zulia: cinco ejercicios contra el reloj, llaves cara a cara, tres jueces por atleta y premio en metálico. Inscripción $20, cupos limitados. Abierta a patrocinadores.',
  openGraph: {
    title: 'Endurance at the Limit · 3ª Edición',
    description: 'Competencia de resistencia en calistenia del Estado Zulia. Inscripciones y patrocinios abiertos.',
    url: 'https://endurance.fortisworkout.org',
    type: 'website',
  },
};

export default function EnduranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`eal ${display.variable}`}>
      {children}
      <SaiyanFx />
    </div>
  );
}
