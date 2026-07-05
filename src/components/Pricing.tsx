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
              <li><span className="check">✓</span> Entrenamiento por objetivos: <strong>Sí</strong></li>
              <li><span className="check">✓</span> Plan Nutricional: <strong>Incluido</strong></li>
              <li><span className="check">✓</span> Meets de apoyo: <strong>3x por semana</strong></li>
              <li><span className="check">✓</span> Evaluación física: <strong>Trimestral</strong></li>
              <li className="disabled"><span className="cross">✕</span> Tips de Mentalidad (Mindset)</li>
              <li className="disabled"><span className="cross">✕</span> Retos de Entrenamiento</li>
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
              <li><span className="check">✓</span> Entrenamiento por objetivos: <strong>Sí</strong></li>
              <li><span className="check">✓</span> Plan Nutricional: <strong>Avanzado</strong></li>
              <li><span className="check">✓</span> Meets de apoyo: <strong>Toda la semana</strong></li>
              <li><span className="check">✓</span> Evaluación física: <strong>Mensual (Sugerido)</strong></li>
              <li><span className="check">✓</span> <strong>Tips de Mentalidad Inquebrantable</strong></li>
              <li><span className="check">✓</span> <strong>Acceso a Retos Exclusivos</strong></li>
            </ul>
            <Link href="/checkout" className="btn btn-primary" suppressHydrationWarning>Quiero resultados reales ya</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
