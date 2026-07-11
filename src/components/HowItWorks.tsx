export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Te registras y completas tu evaluación',
      desc: 'Nos cuentas tu nivel actual, tus objetivos y tu disponibilidad. Con eso, nuestro equipo arma un plan a tu medida.',
    },
    {
      number: '02',
      title: 'Recibes tu plan en la app',
      desc: 'Accedes a tu rutina personalizada con videos de cada ejercicio. Sin adivinar, sin improvisar.',
    },
    {
      number: '03',
      title: 'Entrenas y nos envías tus videos',
      desc: 'Grabas tus ejercicios y los compartes con el equipo. Así sabemos exactamente qué corregir.',
    },
    {
      number: '04',
      title: 'Corregimos y ajustamos en los Meets',
      desc: 'En las sesiones por Google Meet revisamos tu técnica, resolvemos dudas y adaptamos tu plan según tu progreso real.',
    },
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <span className="how-pretitle fade-in">Simple, directo, sin vueltas</span>
        <h2 className="section-title fade-in" style={{ marginBottom: '1rem' }}>
          Así funciona <span className="highlight" style={{ fontSize: 'inherit' }}>Zenkai.</span>
        </h2>
        <p className="how-subtitle fade-in">
          De la duda a la acción en 4 pasos.
        </p>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card fade-in-up">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
