import Link from 'next/link';

export default function Hero() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        <div className="kanji-bg">全開</div>
        <div className="hero-content fade-in-up">
          <span className="pre-title">Entrenamiento Funcional Real y Calistenia</span>
          <h1 className="main-title">
            Estás perdiendo el tiempo si sigues entrenando como <span className="highlight">todo el mundo.</span>
          </h1>
          <p className="subtitle">
            No somos una app de rutinas. Somos una academia con coaches reales que revisan tu técnica, te corrigen y ajustan tu plan según tu progreso.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-large">
              Quiero dejar de perder el tiempo
            </Link>
            <a href="#planes" className="hero-secondary-link">
              Ver planes y precios
            </a>
          </div>
          <ul className="hero-trust">
            <li>Desde $47/mes</li>
            <li>Sin contratos</li>
            <li>Cancela cuando quieras</li>
          </ul>
        </div>
      </section>
      
      {/* Marquee Tape */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>NO EXCUSAS</span>
          <span>•</span>
          <span>CALISTENIA REAL</span>
          <span>•</span>
          <span>ZENKAI ACADEMY</span>
          <span>•</span>
          <span>DISCIPLINA INQUEBRANTABLE</span>
          <span>•</span>
          <span>MÁXIMO POTENCIAL</span>
          <span>•</span>
          <span>NO EXCUSAS</span>
          <span>•</span>
          <span>CALISTENIA REAL</span>
          <span>•</span>
          <span>ZENKAI ACADEMY</span>
          <span>•</span>
          <span>DISCIPLINA INQUEBRANTABLE</span>
          <span>•</span>
          <span>MÁXIMO POTENCIAL</span>
          <span>•</span>
        </div>
      </div>
    </>
  );
}
