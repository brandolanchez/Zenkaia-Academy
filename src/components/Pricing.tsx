import Link from 'next/link';

export default function Pricing() {
  return (
    <section id="planes" className="pricing">
      <div className="container">
        <h2 className="section-title fade-in">El precio de dejar de perder el tiempo.</h2>
        <div className="pricing-table">
          {/* Plan Standard */}
          <div className="pricing-card fade-in">
            <h3 className="plan-name">Standard</h3>
            <p className="plan-desc">El punto de partida para salir del estancamiento.</p>
            <div className="plan-price"><span>$</span>47<span className="period">/mes</span></div>
            
            <ul className="plan-features">
              <li><span className="check">✓</span> App de rutinas en video: <strong>Incluida</strong></li>
              <li><span className="check">✓</span> Corrección de técnica grupal: <strong>Google Meets (3x semana)</strong></li>
              <li><span className="check">✓</span> Plan Nutricional: <strong>Incluido</strong></li>
              <li><span className="check">✓</span> Evaluación física: <strong>Trimestral</strong></li>
              <li className="disabled"><span className="cross">✕</span> Revisión de técnica 1 a 1 en video</li>
              <li className="disabled"><span className="cross">✕</span> Protocolos de Mentalidad Inquebrantable</li>
            </ul>
            <Link href="/checkout" className="btn btn-outline" suppressHydrationWarning>Empezar ahora</Link>
          </div>

          {/* Plan Avanzado (Premium) */}
          <div className="pricing-card premium fade-in">
            <div className="badge">Recomendado</div>
            <h3 className="plan-name">Élite (Avanzado)</h3>
            <p className="plan-desc">La experiencia completa: entrenamiento, mentalidad y contacto diario.</p>
            <div className="plan-price"><span>$</span>97<span className="period">/mes</span></div>
            
            <ul className="plan-features">
              <li><span className="check">✓</span> <strong>Revisión de técnica 1 a 1 en video (Nos envías tus videos)</strong></li>
              <li><span className="check">✓</span> Corrección de técnica grupal: <strong>Google Meets (Libre acceso)</strong></li>
              <li><span className="check">✓</span> App de rutinas en video: <strong>Incluida</strong></li>
              <li><span className="check">✓</span> Plan Nutricional: <strong>Avanzado</strong></li>
              <li><span className="check">✓</span> <strong>Protocolos de Mentalidad Inquebrantable</strong></li>
              <li><span className="check">✓</span> <strong>Evaluación física mensual personalizada</strong></li>
            </ul>
            <Link href="/checkout" className="btn btn-primary" suppressHydrationWarning>Quiero resultados reales ya</Link>
          </div>
        </div>

        <div className="fade-in" style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            ¿No sabes qué plan elegir o si esto se adapta a ti?
          </p>
          <a href="https://calendly.com/edixovillalobos1" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-block' }}>
            Agenda una cita por videollamada
          </a>
        </div>
      </div>
    </section>
  );
}
