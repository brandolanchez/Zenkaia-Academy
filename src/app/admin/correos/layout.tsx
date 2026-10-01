import Link from 'next/link';
import './correos.css';

export default function CorreosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mail">
      <div className="mail-head">
        <h1>Correos</h1>
        <nav className="mail-tabs" aria-label="Secciones de correos">
          <Link href="/admin/correos">Resumen</Link>
          <Link href="/admin/correos/contactos">Contactos</Link>
          <Link href="/admin/correos/campanas">Campañas</Link>
          <Link href="/admin/correos/bandeja">Bandeja</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
