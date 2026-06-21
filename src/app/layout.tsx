import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
