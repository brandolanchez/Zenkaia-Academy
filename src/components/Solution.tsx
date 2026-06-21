import Image from 'next/image';

export default function Solution() {
  return (
    <section className="solution">
      <div className="container solution-grid">
        <div className="solution-content fade-in-left">
          <h2 className="section-title text-left">No somos una app. Somos el empujón que necesitas.</h2>
          <p className="solution-desc">
            Si buscas "rutinitas mágicas" de 10 minutos para hacer en pijama, cierra esta pestaña. En Zenkai Academy combinamos tecnología con mentores de verdad (humanos que respiran y entrenan duro). Nuestro objetivo no es solo que sudes, es que construyas una disciplina inquebrantable que transforme tu estilo de vida.
          </p>
          
          <ul className="solution-list">
            <li>
              <strong>Mentoría implacable:</strong> Contacto directo con atletas y coaches que han estado donde tú estás.
            </li>
            <li>
              <strong>Cero excusas geográficas:</strong> Entrena en tu casa, en un parque o en tu gimnasio de toda la vida.
            </li>
            <li>
              <strong>La manada:</strong> Una comunidad donde el que se rinde destaca (y no dejamos que eso pase).
            </li>
          </ul>
        </div>
        <div className="solution-image-wrapper fade-in-right">
          <div className="glass-accent"></div>
          <Image 
            src="/images/solution.png" 
            alt="Atleta entrenando intensamente" 
            className="solution-img"
            width={600}
            height={400}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}
