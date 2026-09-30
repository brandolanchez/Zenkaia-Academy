import PaymentQrs from '@/components/endurance/PaymentQrs';
import SponsorForm from '@/components/endurance/SponsorForm';
import StickyCta from '@/components/endurance/StickyCta';
import HeroVideo from '@/components/endurance/HeroVideo';

// ─────────────────────────────────────────────────────────────
// DATOS DEL EVENTO — edita aquí fecha, lugar y contacto
// ─────────────────────────────────────────────────────────────
const EVENT = {
  edition: '2ª Edición',
  date: 'Fecha por anunciar',
  venue: 'Maracaibo, Zulia',
  price: 20,
  whatsapp: '584126134013', // 0412-6134013
  whatsappLabel: '0412-613-4013',
};

const waLink = (text: string) => `https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(text)}`;
const WA_INSCRIPCION = waLink('Hola, quiero inscribirme en Endurance at the Limit. Te envío mi comprobante de pago de $20, mi nombre completo y mi categoría.');
const WA_SPONSOR = waLink('Hola, me interesa patrocinar Endurance at the Limit. ¿Me pueden enviar información?');
const WA_DUDA = waLink('Hola, tengo una duda sobre Endurance at the Limit.');

const ROAD = [
  { stage: 'Clasificación', detail: '1 minuto por circuito · 5 ejercicios' },
  { stage: 'Octavos', detail: '16 atletas' },
  { stage: 'Cuartos', detail: '8 atletas' },
  { stage: 'Semifinal', detail: '4 atletas' },
  { stage: 'Final', detail: '2 atletas + duelo por el 3er lugar' },
];

const INCLUDES = [
  'Tu cupo en la clasificación',
  'Jueceo de primer nivel en cada serie',
  'Refrigerio el día del evento',
  'Entrada para 3 acompañantes',
  'Opción a premio en metálico, medalla y trofeo',
];

const FAQ = [
  {
    q: '¿Cuándo queda confirmada mi inscripción?',
    a: 'Cuando envías el comprobante de pago por WhatsApp y te respondemos confirmando tu cupo. Pagar sin enviar el comprobante no reserva el cupo.',
  },
  {
    q: '¿Cuántas personas entran con mi inscripción?',
    a: 'Cuatro en total: tú y tres acompañantes.',
  },
  {
    q: '¿Puedo pagar en bolívares?',
    a: 'Sí, por Pago Móvil o depósito, al equivalente de $20 a la tasa del día. También puedes pagar 20 USDT por Binance.',
  },
  {
    q: '¿Qué se evalúa?',
    a: 'Cinco ejercicios fundamentales y sus variantes. El jurado valida la técnica de cada repetición: dominadas, flexiones y muscle-ups que no cumplen el estándar no suman.',
  },
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
          <a href="#sponsors">Patrocinio</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
        <a href="#inscripcion" className="eal-btn eal-btn-primary eal-nav-cta">Inscribirme</a>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="eal-hero">
          <div className="eal-hero-grid" aria-hidden />
          <div className="eal-hero-glow" aria-hidden />
          <div className="eal-container eal-hero-inner">
            <div className="eal-hero-copy">
              <p className="eal-kicker">
                <span>{EVENT.edition}</span>
                <span>Competencia de calistenia</span>
                <span>{EVENT.venue}</span>
              </p>
              <h1 className="eal-display eal-hero-title">
                Un minuto.<br />
                Cinco ejercicios.<br />
                <span className="eal-accent">Un campeón del Zulia.</span>
              </h1>
              <p className="eal-lead">
                Clasificación por circuitos, top 16 a eliminación directa y un jurado que no deja pasar una repetición a medias.
              </p>
              <div className="eal-hero-actions">
                <a href="#inscripcion" className="eal-btn eal-btn-primary eal-btn-lg">Quiero competir · ${EVENT.price}</a>
                <a href="#sponsors" className="eal-btn eal-btn-ghost eal-btn-lg">Quiero patrocinar</a>
              </div>
            </div>
            <HeroVideo />
          </div>

          <div className="eal-container">
            <dl className="eal-facts">
              <div><dt>Fecha</dt><dd>{EVENT.date}</dd></div>
              <div><dt>Lugar</dt><dd>{EVENT.venue}</dd></div>
              <div><dt>Inscripción</dt><dd>${EVENT.price} · entran 4 personas</dd></div>
              <div><dt>Categorías</dt><dd>Élite y Alfa Junior</dd></div>
            </dl>
          </div>
        </section>

        {/* CINTA */}
        <div className="eal-tape" aria-hidden>
          <div className="eal-tape-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                1 minuto <b>·</b> 5 ejercicios <b>·</b> top 16 <b>·</b> eliminación directa <b>·</b> un campeón <b>·</b> sin repeticiones a medias <b>·</b>{' '}
              </span>
            ))}
          </div>
        </div>

        {/* ELIGE TU LUGAR */}
        <section className="eal-section eal-paths" aria-label="Elige cómo participar">
          <div className="eal-container eal-paths-grid">
            <a href="#inscripcion" className="eal-path eal-path-athlete">
              <span className="eal-path-label">Atletas</span>
              <strong className="eal-display">Vengo a competir</strong>
              <span className="eal-path-text">${EVENT.price} con refrigerio, jueceo y entrada para 3 acompañantes.</span>
              <span className="eal-path-cta">Ver inscripción →</span>
            </a>
            <a href="#sponsors" className="eal-path eal-path-brand">
              <span className="eal-path-label">Marcas</span>
              <strong className="eal-display">Quiero patrocinar</strong>
              <span className="eal-path-text">Tu marca frente a atletas y público de calistenia, en el momento de más tensión.</span>
              <span className="eal-path-cta">Ver patrocinio →</span>
            </a>
          </div>
        </section>

        {/* FORMATO */}
        <section id="formato" className="eal-section">
          <div className="eal-container">
            <p className="eal-eyebrow">El formato</p>
            <h2 className="eal-display eal-h2">El camino al título</h2>
            <p className="eal-intro">
              Primero, un minuto por circuito con cinco ejercicios fundamentales y sus variantes. Los 16 mejores tiempos y puntuaciones pasan a las llaves. De ahí en adelante, cada serie deja a alguien fuera.
            </p>

            <ol className="eal-road">
              {ROAD.map((r, i) => (
                <li key={r.stage} className={i === ROAD.length - 1 ? 'is-final' : ''}>
                  <span className="eal-road-num">{String(i + 1).padStart(2, '0')}</span>
                  <strong className="eal-display">{r.stage}</strong>
                  <span>{r.detail}</span>
                </li>
              ))}
            </ol>

            <div className="eal-cats">
              <article className="eal-cat eal-cat-elite">
                <span className="eal-tag">Categoría Élite</span>
                <h3 className="eal-display">Campeón del Estado Zulia</h3>
                <p>El ganador se lleva el título oficial del estado y la opción de defenderlo en las próximas ediciones.</p>
              </article>
              <article className="eal-cat">
                <span className="eal-tag eal-tag-ghost">Categoría Alfa Junior</span>
                <h3 className="eal-display">Atleta Revelación</h3>
                <p>Reconocimiento al talento emergente que más destaque en la competencia.</p>
              </article>
            </div>
          </div>
        </section>

        {/* JUECEO */}
        <section className="eal-section eal-judging">
          <div className="eal-container">
            <p className="eal-eyebrow">Jueceo</p>
            <h2 className="eal-display eal-h2">Aquí no cuentan las repeticiones a medias</h2>
            <div className="eal-judges">
              <div>
                <strong className="eal-display">Árbitro principal</strong>
                <p>Dirige la serie y decide si cada ejecución es válida.</p>
              </div>
              <div>
                <strong className="eal-display">Ayudante de conteo</strong>
                <p>Lleva las repeticiones en tiempo real.</p>
              </div>
              <div>
                <strong className="eal-display">Mesa técnica</strong>
                <p>Registra tiempos y puntuaciones.</p>
              </div>
            </div>
            <p className="eal-note">
              Dominadas, flexiones y muscle-ups se juzgan con el estándar técnico del reglamento. A todos los participantes se les exige conducta deportiva.
            </p>
          </div>
        </section>

        {/* INSCRIPCIÓN */}
        <section id="inscripcion" className="eal-section eal-register-section">
          <div className="eal-container">
            <p className="eal-eyebrow">Inscripción de atletas</p>
            <h2 className="eal-display eal-h2">Asegura tu cupo en 3 pasos</h2>

            <div className="eal-register">
              {/* Ticket */}
              <div className="eal-ticket">
                <div className="eal-ticket-top">
                  <span className="eal-ticket-label">Inscripción de atleta</span>
                  <span className="eal-display eal-ticket-price">${EVENT.price}</span>
                  <span className="eal-ticket-sub">Entran 4 personas: tú y 3 acompañantes</span>
                </div>
                <ul className="eal-ticket-list">
                  {INCLUDES.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>

              {/* Pasos + pago */}
              <div className="eal-pay">
                <ol className="eal-steps">
                  <li><span>1</span><div><strong>Paga ${EVENT.price}</strong> por Pago Móvil, depósito o Binance.</div></li>
                  <li><span>2</span><div><strong>Envía el comprobante por WhatsApp</strong> con tu nombre completo y tu categoría.</div></li>
                  <li><span>3</span><div><strong>Recibe la confirmación</strong> de tu cupo en el mismo chat.</div></li>
                </ol>

                <PaymentQrs />

                <a href={WA_INSCRIPCION} target="_blank" rel="noopener noreferrer" className="eal-btn eal-btn-whatsapp eal-btn-block eal-btn-lg">
                  Enviar comprobante por WhatsApp
                </a>
                <p className="eal-pay-note">Sin comprobante no hay cupo reservado. WhatsApp: {EVENT.whatsappLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORS */}
        <section id="sponsors" className="eal-section eal-sponsors">
          <div className="eal-container">
            <p className="eal-eyebrow">Patrocinio</p>
            <h2 className="eal-display eal-h2">Tu marca, en el momento de más tensión</h2>
            <p className="eal-intro">
              En una llave de eliminación directa, el público no se distrae: cada serie define quién sigue. Ahí es donde aparece tu marca.
            </p>

            <div className="eal-reasons">
              <article>
                <span className="eal-reason-num eal-display">01</span>
                <h3>Público que te interesa</h3>
                <p>Atletas y seguidores de calistenia y entrenamiento funcional: gente joven y activa, que cuida su salud y consume deporte.</p>
              </article>
              <article>
                <span className="eal-reason-num eal-display">02</span>
                <h3>Atención de principio a fin</h3>
                <p>Octavos, cuartos, semifinal y final. La tensión sube en cada ronda, en el lugar y en redes.</p>
              </article>
              <article>
                <span className="eal-reason-num eal-display">03</span>
                <h3>Un evento con reglamento</h3>
                <p>Jurado por comité, estándar técnico escrito y código de conducta. Tu marca se asocia a un evento organizado.</p>
              </article>
            </div>

            <div className="eal-sponsor-box">
              <div className="eal-sponsor-copy">
                <h3 className="eal-display">Armemos tu participación</h3>
                <p>Puedes participar con presencia de marca en el evento, una activación con el público o aportando premios. Déjanos tus datos y te enviamos la propuesta.</p>
                <a href={WA_SPONSOR} target="_blank" rel="noopener noreferrer" className="eal-link">
                  ¿Prefieres WhatsApp? Escríbenos al {EVENT.whatsappLabel} →
                </a>
              </div>
              <SponsorForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="preguntas" className="eal-section">
          <div className="eal-container eal-faq-wrap">
            <div>
              <p className="eal-eyebrow">Preguntas</p>
              <h2 className="eal-display eal-h2">Antes de inscribirte</h2>
              <a href={WA_DUDA} target="_blank" rel="noopener noreferrer" className="eal-link">¿Otra duda? Pregúntanos por WhatsApp →</a>
            </div>
            <div className="eal-faq">
              {FAQ.map(f => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CIERRE */}
        <section className="eal-final">
          <div className="eal-container">
            <h2 className="eal-display">16 cupos a la llave.<br /><span className="eal-accent">¿Uno es tuyo?</span></h2>
            <a href="#inscripcion" className="eal-btn eal-btn-primary eal-btn-lg">Quiero competir · ${EVENT.price}</a>
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
            <a href="#inscripcion">Inscripción</a>
            <a href="#sponsors">Patrocinio</a>
            <a href={WA_DUDA} target="_blank" rel="noopener noreferrer">WhatsApp {EVENT.whatsappLabel}</a>
          </div>
        </div>
      </footer>

      {/* CTA fijo en móvil */}
      <StickyCta label={`Quiero competir · $${EVENT.price}`} />
    </>
  );
}
