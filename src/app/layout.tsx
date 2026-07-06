import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800', '900'],
  display: 'swap',
  variable: '--font-main',
});

export const metadata: Metadata = {
  title: "Zenkai Academy | Entrenamiento Funcional y Calistenia",
  description: "Desata tu máximo potencial con Zenkai Academy. Ve 'a toda máquina' con un ecosistema digital de mentoría y entrenamiento diseñado para darte resultados reales.",
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
