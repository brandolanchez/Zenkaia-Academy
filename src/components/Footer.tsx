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
            <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="https://instagram.com/dixa_fit" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
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
          <div className="footer-legal">
            <Link href="/terms">Términos y Condiciones</Link>
            <Link href="/privacy">Políticas de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
