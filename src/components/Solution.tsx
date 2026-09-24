import Image from 'next/image';
import Link from 'next/link';

export default function Solution() {
  return (
    <section className="solution">
      <div className="container solution-grid">
        <div className="solution-content fade-in-left">
          <h2 className="section-title text-left">No somos una app. Somos el empujón que necesitas.</h2>
          <p className="solution-desc">
            Si buscas "rutinitas mágicas" de 10 minutos para hacer en pijama, cierra esta pestaña. En Zenkai Academy tienes rutinas en video y coaches que entrenan duro y te revisan de verdad. El objetivo no es solo que sudes: es que construyas la disciplina para seguir cuando la motivación se acabe.
          </p>
          
          <ul className="solution-list">
            <li>
              <strong>Mentoría implacable:</strong> Contacto directo con atletas y coaches que han estado donde tú estás.
            </li>
            <li>
              <strong>Cero excusas geográficas:</strong> Entrena en tu casa, en un parque o en tu gimnasio de toda la vida.
            </li>
            <li>
              <strong>Una comunidad que te empuja:</strong> Entrenas junto a gente con tus mismas metas, que rinde cuentas y no te deja aflojar.
            </li>
          </ul>
          <div style={{ marginTop: '2rem' }}>
            <a href="#planes" className="btn btn-primary">
              Ver los planes de entrenamiento
            </a>
          </div>
        </div>
        <div className="solution-image-wrapper fade-in-right">
          <div className="glass-accent"></div>
          <Image 
            src="/images/images/solution.webp" 
            alt="Atleta entrenando intensamente en la comunidad Zenkai" 
            className="solution-img"
            width={600}
            height={400}
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}
