import PaymentQrs from '@/components/endurance/PaymentQrs';
import SponsorForm from '@/components/endurance/SponsorForm';

// ─────────────────────────────────────────────────────────────
// DATOS DEL EVENTO — edita aquí fecha, lugar y contacto
// ─────────────────────────────────────────────────────────────
const EVENT = {
  edition: '2ª Edición',
  date: 'Fecha por anunciar',
  venue: 'Maracaibo, Estado Zulia',
  price: 20,
  whatsapp: '584126134013', // 0412-6134013
  whatsappLabel: '0412-613-4013',
};

const waLink = (text: string) => `https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(text)}`;
const WA_INSCRIPCION = waLink('Hola, quiero inscribirme en Endurance at the Limit. Te envío mi comprobante de pago de $20.');
const WA_SPONSOR = waLink('Hola, me interesa patrocinar Endurance at the Limit. ¿Me pueden enviar información?');

const INCLUDES = [
  { title: 'Tu cupo en la competencia', desc: 'Clasificación por circuitos y, si entras al top 16, eliminación directa.' },
  { title: 'Jueceo de primer nivel', desc: 'Árbitro principal, ayudante de conteo y mesa técnica en cada serie.' },
  { title: 'Refrigerio', desc: 'Para el día de la competencia.' },
  { title: 'Pase para 3 acompañantes', desc: 'Entras tú y tres personas más: 4 en total.' },
  { title: 'Premios', desc: 'Premio en metálico, medalla y trofeo para los ganadores.' },
];

const STAGES = [
  { label: 'Octavos', count: 16 },
  { label: 'Cuartos', count: 8 },
  { label: 'Semifinal', count: 4 },
  { label: 'Final', count: 2 },
];

export default function EndurancePage() {
  return (
    <>
      {/* NAV */}
      <header className="eal-nav">
        <a href="#top" className="eal-brand" aria-label="Endurance at the Limit, inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/endurance/logo-nav.webp" alt="Endurance at the Limit" width={240} height={212} />
        </a>
        <nav className="eal-nav-links" aria-label="Secciones">
          <a href="#formato">Formato</a>
          <a href="#inscripcion">Inscripción</a>
          <a href="#sponsors">Sponsors</a>
        </nav>
        <a href="#inscripcion" className="eal-btn eal-btn-primary eal-nav-cta">Inscribirme</a>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="eal-hero">
          <div className="eal-hero-bg" aria-hidden />
          <div className="eal-container eal-hero-inner">
            <div className="eal-hero-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/endurance/logo.webp" alt="Endurance at the Limit" width={960} height={849} fetchPriority="high" />
            </div>
            <div className="eal-hero-copy">
            <p className="eal-kicker">{EVENT.edition} · Estado Zulia</p>
            <h1 className="eal-title">
              La competencia de resistencia <span className="eal-title-accent">en calistenia del Zulia.</span>
            </h1>
            <p className="eal-lead">
              Un minuto por circuito. Cinco ejercicios. Solo los 16 mejores pasan a eliminación directa, y el ganador de Élite se lleva el título de campeón del Estado Zulia.
            </p>
            <div className="eal-hero-actions">
              <a href="#inscripcion" className="eal-btn eal-btn-primary">Inscribirme · ${EVENT.price}</a>
              <a href="#sponsors" className="eal-btn eal-btn-ghost">Quiero patrocinar</a>
            </div>
            <dl className="eal-hero-meta">
              <div><dt>Fecha</dt><dd>{EVENT.date}</dd></div>
              <div><dt>Lugar</dt><dd>{EVENT.venue}</dd></div>
              <div><dt>Inscripción</dt><dd>${EVENT.price} · incluye 3 acompañantes</dd></div>
            </dl>
            </div>
          </div>
        </section>

        {/* CIFRAS */}
        <section className="eal-stats" aria-label="El formato en cifras">
          <div className="eal-container eal-stats-grid">
            <div><strong>1 min</strong><span>por circuito</span></div>
            <div><strong>5</strong><span>ejercicios fundamentales</span></div>
            <div><strong>Top 16</strong><span>a eliminación directa</span></div>
            <div><strong>2</strong><span>categorías</span></div>
          </div>
        </section>

        {/* FORMATO */}
        <section id="formato" className="eal-section">
          <div className="eal-container">
            <p className="eal-eyebrow">Cómo se compite</p>
            <h2 className="eal-h2">Resistencia, técnica y velocidad. <em>Sin margen para repeticiones a medias.</em></h2>

            <div className="eal-phases">
              <article className="eal-phase">
                <span className="eal-phase-num">01</span>
                <h3>Clasificación</h3>
                <p>Cada atleta tiene un minuto por circuito, con cinco ejercicios fundamentales y sus variantes. Los 16 mejores tiempos y puntuaciones avanzan.</p>
              </article>
              <article className="eal-phase">
                <span className="eal-phase-num">02</span>
                <h3>Llaves finales</h3>
                <p>Enfrentamientos directos: octavos, cuartos, semifinales, final y definición del tercer lugar. Cada serie elimina a alguien.</p>
              </article>
              <article className="eal-phase">
                <span className="eal-phase-num">03</span>
                <h3>Coronación</h3>
                <p>El ganador de Élite es el campeón oficial del Estado Zulia y puede defender su título en las próximas ediciones.</p>
              </article>
            </div>

            <div className="eal-bracket" aria-label="Llave de eliminación directa">
              {STAGES.map(s => (
                <div key={s.label} className="eal-bracket-col">
                  <span className="eal-bracket-count">{s.count}</span>
                  <span className="eal-bracket-label">{s.label}</span>
                </div>
              ))}
              <div className="eal-bracket-col eal-bracket-champ">
                <span className="eal-bracket-count">1</span>
                <span className="eal-bracket-label">Campeón</span>
              </div>
              <p className="eal-bracket-note">+ duelo por el 3er lugar</p>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="eal-section eal-section-alt">
          <div className="eal-container">
            <p className="eal-eyebrow">Categorías</p>
            <h2 className="eal-h2">Dos categorías. <em>Dos títulos en juego.</em></h2>
            <div className="eal-cats">
              <article className="eal-cat eal-cat-main">
                <span className="eal-tag">Élite</span>
                <h3>Campeón del Estado Zulia</h3>
                <p>El título oficial del estado, con opción a defenderlo en ediciones futuras.</p>
              </article>
              <article className="eal-cat">
                <span className="eal-tag eal-tag-ghost">Alfa Junior</span>
                <h3>Atleta Revelación</h3>
                <p>Reconocimiento al talento emergente que más destaque en la competencia.</p>
              </article>
            </div>
          </div>
        </section>

        {/* JUECEO */}
        <section className="eal-section">
          <div className="eal-container eal-split">
            <div>
              <p className="eal-eyebrow">Juego limpio</p>
              <h2 className="eal-h2">Cada repetición se cuenta. <em>Y se valida.</em></h2>
              <p className="eal-body">
                Un comité de jueces supervisa cada serie y revisa que la técnica se cumpla con exactitud: dominadas, flexiones y muscle-ups que no cumplen el estándar no suman. A todos los participantes se les exige ética deportiva y conducta profesional.
              </p>
            </div>
            <ul className="eal-judges">
              <li><strong>Árbitro principal</strong><span>Dirige la serie y valida cada ejecución.</span></li>
              <li><strong>Ayudante de conteo</strong><span>Lleva el conteo de repeticiones en tiempo real.</span></li>
              <li><strong>Mesa técnica</strong><span>Registra tiempos y puntuaciones.</span></li>
            </ul>
          </div>
        </section>

        {/* INSCRIPCIÓN */}
        <section id="inscripcion" className="eal-section eal-section-alt">
          <div className="eal-container">
            <p className="eal-eyebrow">Para atletas</p>
            <h2 className="eal-h2">Inscríbete por <em>${EVENT.price}.</em></h2>

            <div className="eal-register">
              <div>
                <ul className="eal-includes">
                  {INCLUDES.map(i => (
                    <li key={i.title}>
                      <strong>{i.title}</strong>
                      <span>{i.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="eal-pay">
                <ol className="eal-steps">
                  <li><span>1</span>Paga ${EVENT.price} por Pago Móvil o Binance.</li>
                  <li><span>2</span>Envía el comprobante por WhatsApp con tu nombre completo y tu categoría.</li>
                  <li><span>3</span>Te confirmamos el cupo por el mismo chat.</li>
                </ol>

                <PaymentQrs />

                <p className="eal-pay-warning">
                  Tu inscripción queda confirmada solo cuando envías el comprobante por WhatsApp al <strong>{EVENT.whatsappLabel}</strong>.
                </p>
                <a href={WA_INSCRIPCION} target="_blank" rel="noopener noreferrer" className="eal-btn eal-btn-whatsapp eal-btn-block">
                  Enviar comprobante por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORS */}
        <section id="sponsors" className="eal-section eal-sponsors">
          <div className="eal-container">
            <p className="eal-eyebrow">Para marcas</p>
            <h2 className="eal-h2">Pon tu marca donde está <em>la comunidad más activa de calistenia del Zulia.</em></h2>

            <div className="eal-reasons">
              <article>
                <h3>Atención sostenida</h3>
                <p>La eliminación directa crea momentos de máxima tensión, serie tras serie. El público presente y la audiencia digital siguen cada llave hasta la final.</p>
              </article>
              <article>
                <h3>Público afín</h3>
                <p>Atletas y seguidores de calistenia y entrenamiento funcional: gente joven, activa y enfocada en salud, deporte y estilo de vida.</p>
              </article>
              <article>
                <h3>Un evento serio</h3>
                <p>Reglamento general de competición, jueceo por comité y código de conducta. Tu marca se asocia a un evento organizado y bien reglamentado.</p>
              </article>
            </div>

            <div className="eal-sponsor-contact">
              <div>
                <h3 className="eal-h3">Hablemos de tu participación</h3>
                <p className="eal-body">Armamos la participación según lo que busca tu marca: visibilidad en el evento, activaciones o premios. Déjanos tus datos y te enviamos la propuesta.</p>
                <a href={WA_SPONSOR} target="_blank" rel="noopener noreferrer" className="eal-btn eal-btn-ghost">
                  Prefiero escribir por WhatsApp
                </a>
              </div>
              <SponsorForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="eal-footer">
        <div className="eal-container eal-footer-inner">
          <div className="eal-footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/endurance/logo-nav.webp" alt="Endurance at the Limit" width={240} height={212} loading="lazy" />
            <p>{EVENT.edition} · {EVENT.venue}</p>
          </div>
          <div className="eal-footer-links">
            <a href={WA_INSCRIPCION} target="_blank" rel="noopener noreferrer">WhatsApp {EVENT.whatsappLabel}</a>
            <a href="#sponsors">Patrocinios</a>
          </div>
        </div>
      </footer>

      {/* CTA fijo en móvil */}
      <a href="#inscripcion" className="eal-mobile-cta">Inscribirme · ${EVENT.price}</a>
    </>
  );
}
