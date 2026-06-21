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
            Estás perdiendo el tiempo si sigues entrenando como el <span className="highlight">90% de la gente.</span>
          </h1>
          <p className="subtitle">
            Las aplicaciones genéricas de 5 dólares no te van a dar el cuerpo ni la mentalidad que buscas. Necesitas a alguien que te mire de frente, te quite las dudas de la cabeza y te diga qué estás haciendo mal. Para eso nació Zenkai Academy.
          </p>
          <Link href="#planes" className="btn btn-primary" suppressHydrationWarning>
            Ver cómo trabajamos
          </Link>
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
