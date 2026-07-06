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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
