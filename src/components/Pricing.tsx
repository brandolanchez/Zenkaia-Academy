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
            <p className="plan-desc">Ideal para salir del estancamiento y recuperar la motivación.</p>
            <div className="plan-price"><span>$</span>50<span className="period">/mes</span></div>
            
            <ul className="plan-features">
              <li><span className="check">✓</span> Acceso a la App y Guías: <strong>Incluido</strong></li>
              <li><span className="check">✓</span> Mentorías Grupales: <strong>3x semana</strong></li>
              <li className="disabled"><span className="cross">✕</span> Seguimiento Personalizado</li>
              <li className="disabled"><span className="cross">✕</span> Evaluación y Nutrición</li>
            </ul>
            <Link href="#" className="btn btn-outline" suppressHydrationWarning>Quiero recuperar mi tiempo</Link>
          </div>

          {/* Plan Avanzado (Premium) */}
          <div className="pricing-card premium fade-in">
            <div className="badge">Zenkai Academy</div>
            <h3 className="plan-name">Avanzado</h3>
            <p className="plan-desc">Para quienes valoran la exclusividad y el máximo rendimiento.</p>
            <div className="plan-price"><span>$</span>90<span className="period">/mes</span></div>
            
            <ul className="plan-features">
              <li><span className="check">✓</span> Acceso a la App y Guías: <strong>Incluido</strong></li>
              <li><span className="check">✓</span> Mentorías Grupales: <strong>Ilimitado</strong></li>
              <li><span className="check">✓</span> Seguimiento: <strong>1 a 1 altamente personalizado</strong></li>
              <li><span className="check">✓</span> Nutrición: <strong>Evaluación exhaustiva</strong></li>
            </ul>
            <Link href="#" className="btn btn-primary" suppressHydrationWarning>Quiero resultados reales ya</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
