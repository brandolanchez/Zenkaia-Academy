import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Outfit servida desde el proyecto (licencia OFL). Así el build no depende de
// descargar fuentes de Google, que falla con Turbopack en Netlify.
const outfit = localFont({
  src: [
    { path: './fonts/outfit-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/outfit-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/outfit-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/outfit-latin-800-normal.woff2', weight: '800', style: 'normal' },
    { path: './fonts/outfit-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-main',
});

export const metadata: Metadata = {
  title: "Zenkai Academy | Entrenamiento Funcional y Calistenia",
  description: "Calistenia y entrenamiento funcional con coaches reales. Rutinas en video, plan nutricional y corrección de técnica en vivo. Planes desde $47/mes, sin contratos.",
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        {children}
        
        {/* Yandex Metrica */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=110463891', 'ym');

            ym(110463891, 'init', {
                 ssr:true, 
                 webvisor:true, 
                 clickmap:true, 
                 ecommerce:"dataLayer", 
                 referrer: document.referrer, 
                 url: location.href, 
                 accurateTrackBounce:true, 
                 trackLinks:true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/110463891" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
