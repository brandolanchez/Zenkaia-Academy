import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Image 
            src="/images/images/logo 2.svg" 
            alt="Zenkai Academy" 
            width={160} 
            height={45} 
          />
          <span style={{ fontSize: '0.65rem', fontWeight: 400, letterSpacing: '12px', color: 'var(--text-secondary)', marginTop: '0.1rem', marginRight: '-12px' }}>
            ACADEMY
          </span>
        </div>
        <p>&copy; 2025 Zenkai Academy. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
