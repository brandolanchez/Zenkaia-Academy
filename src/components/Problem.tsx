export default function Problem() {
  return (
    <section className="problem">
      <div className="container">
        <h2 className="section-title fade-in">Ese momento frente al espejo donde te das cuenta de que nada ha cambiado.</h2>
        
        <div className="story-content fade-in" style={{ maxWidth: '800px', margin: '0 auto 5rem auto', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          <p>
            Llevas meses, tal vez años, intentando ponerte en forma. Descargas una app, sigues rutinas aleatorias de internet y durante dos semanas te sientes invencible. Luego llega la vida real: el cansancio, la falta de tiempo... y lo dejas. Vuelves a la casilla de salida. 
            <br/><br/>
            No es que te falte fuerza de voluntad, ni es tu "genética". Es que intentar cambiar tu vida y tu físico en solitario, sin un plan real, es la receta perfecta para el abandono.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1 - Full Width Top */}
          <div className="card bento-main fade-in">
            <div className="pain-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <rect x="5" y="2" width="14" height="20"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3 className="card-title">El espejismo de las apps</h3>
            <p>Te tratan como a un número más. No hay exigencia real, solo algoritmos pregrabados que no te conocen y no se adaptan a tu nivel de cansancio o frustración.</p>
          </div>
          
          {/* Card 2 */}
          <div className="card fade-in">
            <div className="pain-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3 className="card-title">Motivación de cristal</h3>
            <p>Dura exactamente hasta tu primer día de estrés. Sin nadie a quien rendirle cuentas, el sofá siempre gana la batalla.</p>
          </div>
          
          {/* Card 3 */}
          <div className="card fade-in">
            <div className="pain-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="card-title">La rueda del hámster</h3>
            <p>Entrenas en piloto automático. Sudas para cansarte, pero los meses pasan y te sigues viendo exactamente igual en el espejo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
