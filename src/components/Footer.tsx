import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <Image 
                src="/images/images/logo 2.svg" 
                alt="Zenkai Academy" 
                width={140} 
                height={40} 
              />
              <span style={{ fontSize: '0.6rem', fontWeight: 400, letterSpacing: '10px', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                ACADEMY
              </span>
            </div>
            <p className="footer-tagline">
              Entrenamiento funcional real con mentoría humana. No somos una app, somos el empujón que necesitas.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              <li><a href="#planes">Planes</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
              <li><Link href="/register">Únete Ahora</Link></li>
              <li><Link href="/login">Iniciar Sesión</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-links">
              <li>
                <a href="https://wa.me/584127862283" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://calendly.com/edixovillalobos1" target="_blank" rel="noopener noreferrer">
                  Agendar videollamada
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Zenkai Academy. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
