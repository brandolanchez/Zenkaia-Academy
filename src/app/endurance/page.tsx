import PaymentQrs from '@/components/endurance/PaymentQrs';
import SponsorForm from '@/components/endurance/SponsorForm';
import PastEditions from '@/components/endurance/PastEditions';
import StickyCta from '@/components/endurance/StickyCta';
import HeroVideo from '@/components/endurance/HeroVideo';
import Countdown from '@/components/endurance/Countdown';
import RegisterWhatsApp from '@/components/endurance/RegisterWhatsApp';

// ─────────────────────────────────────────────────────────────
// DATOS DEL EVENTO — edita aquí fecha, lugar y contacto
// ─────────────────────────────────────────────────────────────
const EVENT = {
  edition: '3ª Edición',
  date: 'Diciembre · por definir',
  dateDetail: 'Segunda semana de diciembre. Anunciamos el día exacto en Instagram.',
  // Cuando haya fecha confirmada, pon aquí la fecha y hora (hora de Venezuela) y aparece
  // la cuenta regresiva en el hero. Ejemplo: '2026-12-12T08:00:00-04:00'
  dateISO: null as string | null,
  // Enlace al reglamento completo (PDF en /public o Google Drive). Vacío = "próximamente".
  reglamentoUrl: '',
  venue: 'Maracaibo, Zulia',
  price: 20,
  whatsapp: '584126134013', // 0412-6134013
  whatsappLabel: '0412-613-4013',
  instagram: '@fortisworkout',
  instagramUrl: 'https://www.instagram.com/fortisworkout/',
  spotsPerCategory: 20, // cupos por categoría (Élite y Alfa Junior)
  // Inscripciones confirmadas. Pon aquí las cifras reales y cambia showRemaining a true
  // para mostrar "Solo quedan X cupos" con barras de progreso en toda la página.
  sold: { elite: 0, junior: 0 },
  showRemaining: false,
};

const LEFT = {
  elite: Math.max(EVENT.spotsPerCategory - EVENT.sold.elite, 0),
  junior: Math.max(EVENT.spotsPerCategory - EVENT.sold.junior, 0),
};

const N = EVENT.spotsPerCategory;
const SPOTS_LINE = EVENT.showRemaining
  ? `Solo quedan ${LEFT.elite} cupos en Élite y ${LEFT.junior} en Alfa Junior.`
  : `Solo ${N} cupos por categoría. Se asignan por orden de pago confirmado.`;

const SPOTS = [
  { name: 'Élite', left: LEFT.elite, sold: EVENT.sold.elite },
  { name: 'Alfa Junior', left: LEFT.junior, sold: EVENT.sold.junior },
];

function SpotsLeft() {
  return (
    <div className="eal-spots">
      {SPOTS.map(c => (
        <div key={c.name} className="eal-spot">
          <div className="eal-spot-head">
            <span>{c.name}</span>
            <strong>{c.left === 0 ? 'Agotado' : <>Solo quedan <b>{c.left}</b> cupos</>}</strong>
          </div>
          <div className="eal-spot-bar" role="img" aria-label={`${c.name}: ${c.sold} de ${EVENT.spotsPerCategory} cupos vendidos`}>
            <span style={{ width: `${(c.sold / EVENT.spotsPerCategory) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const waLink = (text: string) => `https://wa.me/${EVENT.whatsapp}?text=${encodeURIComponent(text)}`;
const WA_INSCRIPCION = waLink('Hola, quiero inscribirme en Endurance at the Limit. Te envío mi comprobante de pago de $20, mi nombre completo y mi categoría.');
const PRIZES = [
  { place: '1.er lugar', amount: 100 },
  { place: '2.º lugar', amount: 80 },
  { place: '3.er lugar', amount: 50 },
];

// Imágenes en /public/images/endurance/pop (versiones de 800 y 1400 px)
const GEAR = [
  { key: 'credenciales', label: 'Credenciales del staff', alt: 'Credenciales de seguridad y organizador de Endurance at the Limit', w: 1400, h: 788 },
  { key: 'franelas', label: 'Franelas del staff', alt: 'Franela negra de organizador con el logo de Endurance at the Limit', w: 1400, h: 791 },
  { key: 'lanyard', label: 'Lanyards', alt: 'Lanyard naranja con el logo de Endurance at the Limit', w: 1400, h: 896 },
  { key: 'pulsera', label: 'Pulseras de acceso', alt: 'Pulsera de acceso naranja de Endurance at the Limit', w: 1400, h: 511 },
  { key: 'stickers', label: 'Stickers', alt: 'Stickers con el logo de Endurance at the Limit', w: 1400, h: 788 },
];

// El día del evento (sin horas hasta que haya fecha)
const DAY = [
  { t: 'Chequeo y pases', d: 'El equipo de protocolo te recibe, verifica tu inscripción y te entrega tu pase. Llega una hora antes.' },
  { t: 'Chequeo médico', d: 'Antes de competir pasas una revisión rápida. El equipo de primeros auxilios está en el lugar todo el evento.' },
  { t: 'Calentamiento', d: 'Tiempo para preparar el cuerpo y conocer la zona de competencia.' },
  { t: 'Clasificación', d: 'Élite y Alfa Junior pasan por su ronda. Tu puntaje define tu lugar en la llave.' },
  { t: 'Llaves', d: 'Octavos, cuartos, semifinal, tercer lugar y final, cara a cara.' },
  { t: 'Premiación', d: 'Podio, premio en metálico, medallas y trofeos.' },
];

// Niveles de patrocinio (los mismos de los correos)
const TIERS = [
  { name: 'Patrocinador principal', price: '$300', spots: '1 cupo', perks: ['"Endurance at the Limit, presentado por tu marca"', 'Logo principal en backdrop, medallas y redes', 'Stand o activación con atletas y público', 'Entrega del premio de la final'], featured: true },
  { name: 'Patrocinio de categoría', price: '$150', spots: '2 cupos: Élite y Alfa Junior', perks: ['Los premios de la categoría llevan tu nombre', 'Tu marca entrega los premios en el podio', 'Logo en backdrop y web'] },
  { name: 'Aliado oficial', price: '$50', spots: 'o su equivalente en producto', perks: ['Logo en backdrop y web', 'Menciones del animador durante el evento'] },
  { name: 'Aliado en especie', price: 'Producto', spots: 'bebidas, comida, premios, servicios', perks: ['Hidratación, refrigerio o premios del podio', 'Logo en la web y mención en el evento'] },
];

const PAST_SPONSORS = ['HIVE', 'Valhalla Fitness Center', 'Nature'];

const WA_SPONSOR = waLink('Hola, me interesa patrocinar Endurance at the Limit. ¿Me pueden enviar información?');
const WA_DUDA = waLink('Hola, tengo una duda sobre Endurance at the Limit.');

const ROAD = [
  { stage: 'Clasificación', detail: '1 minuto para sumar tu mejor puntuación. Nadie queda fuera: tu puntaje define tu lugar en la llave.' },
  { stage: 'Octavos', detail: 'Los jueces arman los cruces para que los mejores no se enfrenten antes de tiempo.' },
  { stage: 'Cuartos', detail: '8 atletas. Cruces por sorteo.' },
  { stage: 'Semifinal', detail: '4 atletas. Los dos que caen pelean el 3er lugar.' },
  { stage: 'Final', detail: '2 atletas. Uno se lleva el título.' },
];

const NULLS = [
  { t: 'Flexiones', d: 'Con los dedos flexionados, o apoyado en un bordillo, una barra o una superficie inclinada.' },
  { t: 'Tracción y empuje', d: 'Con los pies despegados del suelo cuando no corresponde: la repetición es nula y hay que hacerla de nuevo.' },
  { t: 'Muscle-up', d: 'Subir primero un brazo y luego el otro no cuenta. En Élite, en octavos y cuartos, tampoco se permite encoger las piernas.' },
];

const INCLUDES = [
  'Tu cupo en la clasificación',
  'Jueceo de primer nivel en cada serie',
  'Refrigerio el día del evento',
  'Chequeo médico y equipo de primeros auxilios',
  'Entrada para 3 acompañantes',
  'Premio en metálico, medalla y trofeo para los ganadores',
];

const FAQ = [
  {
    q: '¿En qué categoría me inscribo?',
    a: 'Eliges tu categoría al inscribirte: Élite, la de mayor nivel, o Alfa Junior, para quienes están empezando a competir. Si entrenas en Fortis Workout, la decide tu capitán. Si vienes de otro club o del interior, la eliges tú según tu nivel. Las dos categorías pasan por la clasificación.',
  },
  {
    q: '¿Cuándo queda confirmada mi inscripción?',
    a: 'Cuando envías el comprobante de pago por WhatsApp y te respondemos confirmando tu cupo. Pagar sin enviar el comprobante no reserva el cupo.',
  },
  {
    q: '¿Cuántos cupos hay?',
    a: EVENT.showRemaining
      ? `${N} por categoría. Hoy quedan ${LEFT.elite} en Élite y ${LEFT.junior} en Alfa Junior. Se asignan en el orden en que confirmamos los comprobantes, y cuando una categoría se llena, se cierra.`
      : `${N} en Élite y ${N} en Alfa Junior. Se asignan en el orden en que confirmamos los comprobantes, y cuando una categoría se llena, se cierra.`,
  },
  {
    q: '¿Cuántas personas entran con mi inscripción?',
    a: 'Cuatro en total: tú y tres acompañantes.',
  },
  {
    q: '¿Puedo pagar en bolívares?',
    a: 'Sí, por Pago Móvil a Bancamiga. El monto en bolívares se calcula a la tasa oficial del euro del BCV, y en la sección de inscripción te mostramos la cifra exacta del día. Si prefieres pagar en dólares, son 20 USDT por Binance Pay.',
  },
  {
    q: '¿A qué hora tengo que llegar?',
    a: 'Una hora antes del inicio. El equipo de protocolo te recibe, verifica tu inscripción y te entrega tu pase; después pasas el chequeo médico y calientas. Si no estás a la hora del chequeo, quedas descalificado. La fecha y la hora exactas se anuncian en Instagram y en los grupos de cada club.',
  },
  {
    q: '¿Qué tengo que llevar?',
    a: 'La franela de tu club. El magnesio está permitido. Si quieres usar cualquier otro implemento, avísanos al menos 15 días antes para que el jurado lo apruebe.',
  },
  {
    q: '¿Hay atención médica durante la competencia?',
    a: 'Sí. Antes de competir pasas un chequeo médico, y un equipo de primeros auxilios está en el lugar durante todo el evento. Si el chequeo detecta un riesgo para tu salud, el equipo médico puede indicar que no compitas.',
  },
  {
    q: 'Tengo una lesión o una condición en las articulaciones. ¿Puedo competir?',
    a: 'Avísanos con anticipación (hasta 15 días antes) y díselo a los jueces antes de empezar. Ellos evalúan tu caso para no anular repeticiones que por tu condición no puedes ejecutar exactamente igual.',
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
          <a href="#ediciones">Ediciones</a>
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
                <span>Endurance at the Limit</span>
                <span>{EVENT.venue}</span>
              </p>
              <h1 className="eal-display eal-hero-title">
                ¿Cuánto <span className="eal-accent">aguantas?</span>
              </h1>
              <p className="eal-lead">
                El reto de resistencia en calistenia del Zulia: cinco ejercicios contra el reloj, llaves cara a cara y premio en metálico para quien llegue al final.
              </p>
              <div className="eal-hero-actions">
                <a href="#inscripcion" className="eal-btn eal-btn-primary eal-btn-lg">Quiero competir · ${EVENT.price}</a>
                <a href="#sponsors" className="eal-btn eal-btn-ghost eal-btn-lg">Quiero patrocinar</a>
              </div>
              <p className="eal-scarcity">
                <span className="eal-dot" aria-hidden />
                {SPOTS_LINE}
              </p>
              <Countdown dateISO={EVENT.dateISO} />
            </div>
            <HeroVideo />
          </div>

          <div className="eal-container">
            <dl className="eal-facts">
              <div><dt>Fecha</dt><dd>{EVENT.date}<small>{EVENT.dateDetail}</small></dd></div>
              <div><dt>Lugar</dt><dd>{EVENT.venue}</dd></div>
              <div><dt>Inscripción</dt><dd>${EVENT.price} · entran 4 personas</dd></div>
              <div><dt>Premios</dt><dd>Dinero, medalla y trofeo</dd></div>
            </dl>
          </div>
        </section>

        {/* CINTA */}
        <div className="eal-tape" aria-hidden>
          <div className="eal-tape-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                5 ejercicios <b>·</b> orden estricto <b>·</b> contra el reloj <b>·</b> llaves cara a cara <b>·</b> premio en metálico <b>·</b> 3 jueces por atleta <b>·</b>{' '}
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
              <span className="eal-path-text">{EVENT.showRemaining ? `Quedan ${LEFT.elite} cupos en Élite y ${LEFT.junior} en Alfa Junior.` : `Solo ${N} cupos por categoría.`} ${EVENT.price} con refrigerio, jueceo y entrada para 3 acompañantes.</span>
              <span className="eal-path-cta">Ver inscripción →</span>
            </a>
            <a href="#sponsors" className="eal-path eal-path-brand">
              <span className="eal-path-label">Marcas</span>
              <strong className="eal-display">Quiero patrocinar</strong>
              <span className="eal-path-text">Tu marca frente a los atletas y el público de calistenia del Zulia, ronda tras ronda.</span>
              <span className="eal-path-cta">Ver patrocinio →</span>
            </a>
          </div>
        </section>

        {/* EDICIONES ANTERIORES */}
        <section id="ediciones" className="eal-section eal-past">
          <div className="eal-container">
            <p className="eal-eyebrow">Ediciones anteriores</p>
            <h2 className="eal-display eal-h2">Así se vive Endurance</h2>
            <p className="eal-intro">
              Dos ediciones, público alrededor de cada serie y premiación en el podio. Toca cualquier foto para verla en grande.
            </p>
            <PastEditions />
          </div>
        </section>

        {/* FORMATO */}
        <section id="formato" className="eal-section">
          <div className="eal-container">
            <p className="eal-eyebrow">El formato</p>
            <h2 className="eal-display eal-h2">Cómo se gana</h2>
            <p className="eal-intro">
              Cada circuito tiene cinco ejercicios con sus variantes, un número fijo de repeticiones y un orden que no se puede cambiar. Gana quien lo termina en menos tiempo, con todas sus repeticiones válidas.
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
            <p className="eal-road-note">La clasificación no elimina a nadie. Sirve para ordenar la llave: con tu puntaje, los jueces arman los cruces para que los más fuertes no se eliminen entre ellos en la primera ronda y la final sea la que tiene que ser.</p>

            <div className="eal-cats">
              <article className="eal-cat eal-cat-elite">
                <span className="eal-tag">Categoría Élite</span>
                <h3 className="eal-display">Campeón de resistencia del Zulia</h3>
                <p>El primer lugar se lleva el título estatal de la modalidad, premio en metálico, medalla y trofeo, y defiende el título en las siguientes ediciones, hasta un máximo de cuatro.</p>
              </article>
              <article className="eal-cat">
                <span className="eal-tag eal-tag-ghost">Categoría Alfa Junior</span>
                <h3 className="eal-display">Atleta Revelación</h3>
                <p>En esta categoría no hay campeón: el primer lugar recibe el título de Atleta Revelación, un empujón para subir de categoría en las próximas ediciones.</p>
              </article>
            </div>

            <div className="eal-prize">
              <figure className="eal-prize-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/endurance/pop/trofeo-800.webp"
                  srcSet="/images/endurance/pop/trofeo-800.webp 800w, /images/endurance/pop/trofeo-1400.webp 1400w"
                  sizes="(max-width: 1000px) 100vw, 560px"
                  alt="Trofeo de primer lugar de Endurance at the Limit, tercera edición"
                  width={1400}
                  height={967}
                  loading="lazy"
                />
              </figure>
              <div className="eal-prize-copy">
                <p className="eal-eyebrow">Premios por categoría</p>
                <h3 className="eal-display">Lo que se lleva el podio</h3>
                <ol className="eal-prize-list">
                  {PRIZES.map(p => (
                    <li key={p.place}>
                      <span>{p.place}</span>
                      <strong className="eal-display">${p.amount}</strong>
                    </li>
                  ))}
                </ol>
                <p className="eal-prize-note">En efectivo, en Élite y en Alfa Junior. Medalla y trofeo para los ganadores.</p>
              </div>
            </div>
          </div>
        </section>

        {/* JUECEO */}
        <section className="eal-section eal-judging">
          <div className="eal-container">
            <p className="eal-eyebrow">Jueceo</p>
            <h2 className="eal-display eal-h2">Tres jueces para cada atleta</h2>
            <div className="eal-judges">
              <div>
                <strong className="eal-display">Árbitro principal</strong>
                <p>Evalúa la técnica, aplica las penalizaciones y registra tu resultado.</p>
              </div>
              <div>
                <strong className="eal-display">Árbitro ayudante</strong>
                <p>Cuenta tus repeticiones, verifica que sean válidas y te guía en el orden del circuito.</p>
              </div>
              <div>
                <strong className="eal-display">Mesa técnica</strong>
                <p>Registra tu ejecución.</p>
              </div>
            </div>

            <h3 className="eal-subhead">Qué anula una repetición</h3>
            <div className="eal-nulls">
              {NULLS.map(n => (
                <div key={n.t}>
                  <strong>{n.t}</strong>
                  <p>{n.d}</p>
                </div>
              ))}
            </div>
            <p className="eal-note">
              En semifinal, final y tercer lugar el jurado es más flexible con la forma del muscle-up, por el cansancio acumulado. Saltarse un set o hacer una serie completa mal puede costar la descalificación, igual que cualquier falta de conducta con otro atleta, el jurado, el público o la organización.
            </p>
          </div>
        </section>

        {/* EL DÍA DEL EVENTO */}
        <section id="cronograma" className="eal-section eal-day">
          <div className="eal-container">
            <p className="eal-eyebrow">El día del evento</p>
            <h2 className="eal-display eal-h2">De la llegada al podio</h2>
            <p className="eal-intro">Los horarios se publican con la fecha. El orden es este:</p>
            <ol className="eal-day-list">
              {DAY.map((d, i) => (
                <li key={d.t}>
                  <span className="eal-day-num eal-display">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{d.t}</strong>
                    <p>{d.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="eal-docs">
              {EVENT.reglamentoUrl ? (
                <a href={EVENT.reglamentoUrl} target="_blank" rel="noopener noreferrer" className="eal-doc-link">Reglamento completo (PDF) →</a>
              ) : (
                <span className="eal-doc-link is-soon" aria-disabled="true">Reglamento completo · próximamente</span>
              )}
              <a href="/exoneracion" className="eal-doc-link">Exoneración de responsabilidad →</a>
            </div>
          </div>
        </section>

        {/* INSCRIPCIÓN */}
        <section id="inscripcion" className="eal-section eal-register-section">
          <div className="eal-container">
            <p className="eal-eyebrow">Inscripción de atletas</p>
            <h2 className="eal-display eal-h2">Asegura tu cupo en 3 pasos</h2>
            <p className="eal-intro">
              Son {N} cupos por categoría. Tu cupo queda reservado cuando confirmamos tu comprobante, no antes. Cuando una categoría se llena, se cierra.
            </p>
            {EVENT.showRemaining && <SpotsLeft />}

            <div className="eal-register">
              {/* Ticket */}
              <div className="eal-ticket">
                <div className="eal-ticket-top">
                  <span className="eal-ticket-label">Inscripción de atleta</span>
                  <span className="eal-display eal-ticket-price">${EVENT.price}</span>
                  <span className="eal-ticket-sub">Entran 4 personas: tú y 3 acompañantes</span>
                  <span className="eal-ticket-spots">{EVENT.showRemaining ? `Quedan ${LEFT.elite} Élite · ${LEFT.junior} Alfa Junior` : `${N} cupos por categoría`}</span>
                </div>
                <ul className="eal-ticket-list">
                  {INCLUDES.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>

              {/* Pasos + pago */}
              <div className="eal-pay">
                <ol className="eal-steps">
                  <li><span>1</span><div><strong>Paga</strong> por Pago Móvil (en bolívares, a tasa euro BCV) o 20 USDT por Binance Pay.</div></li>
                  <li><span>2</span><div><strong>Llena tus datos abajo</strong> y toca el botón: se abre WhatsApp con tu inscripción escrita. Adjunta la captura del pago y envía.</div></li>
                  <li><span>3</span><div><strong>Recibe la confirmación</strong> de tu cupo en el mismo chat.</div></li>
                </ol>

                <PaymentQrs />

                <div className="eal-category-help">
                  <strong>¿Élite o Alfa Junior?</strong>
                  <p>Élite es la categoría de mayor nivel; Alfa Junior, para quienes están empezando a competir. Si entrenas en Fortis Workout, la decide tu capitán. Si vienes de otro club o del interior, la eliges tú. Las dos pasan por la clasificación.</p>
                </div>

                <RegisterWhatsApp whatsapp={EVENT.whatsapp} edition={EVENT.edition} />
                <p className="eal-pay-note">
                  Sin comprobante no hay cupo reservado. ¿Prefieres escribir tú? <a href={WA_INSCRIPCION} target="_blank" rel="noopener noreferrer">WhatsApp {EVENT.whatsappLabel}</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORS */}
        {/* MATERIAL OFICIAL */}
        <section id="material" className="eal-section eal-gear">
          <div className="eal-container">
            <p className="eal-eyebrow">Material oficial</p>
            <h2 className="eal-display eal-h2">La 3ª edición, hasta el último detalle</h2>
            <p className="eal-intro">
              Franelas, credenciales, lanyards y pulseras con la identidad del evento. Una competencia seria también se nota en lo que se ve.
            </p>
            <div className="eal-gear-grid">
              {GEAR.map(g => (
                <figure key={g.key} className={`eal-gear-item eal-gear-${g.key}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/endurance/pop/${g.key}-800.webp`}
                    srcSet={`/images/endurance/pop/${g.key}-800.webp 800w, /images/endurance/pop/${g.key}-1400.webp 1400w`}
                    sizes={g.key === 'credenciales' ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                    alt={g.alt}
                    width={g.w}
                    height={g.h}
                    loading="lazy"
                  />
                  <figcaption>{g.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="sponsors" className="eal-section eal-sponsors">
          <div className="eal-container">
            <p className="eal-eyebrow">Patrocinio</p>
            <h2 className="eal-display eal-h2">Pon tu marca donde se decide el campeón</h2>
            <p className="eal-intro">
              Desde octavos, cada enfrentamiento elimina a alguien. El público sigue cada serie de principio a fin, en el lugar y en redes. Ahí aparece tu marca.
            </p>

            <div className="eal-reasons">
              <article>
                <span className="eal-reason-num eal-display">01</span>
                <h3>Público que te interesa</h3>
                <p>Atletas y seguidores de calistenia y entrenamiento funcional: gente joven y activa, que cuida su salud y consume deporte.</p>
              </article>
              <article>
                <span className="eal-reason-num eal-display">02</span>
                <h3>Una llave que sostiene la atención</h3>
                <p>Octavos, cuartos, semifinal, tercer lugar y final: cinco rondas de enfrentamientos directos, con más tensión en cada una.</p>
              </article>
              <article>
                <span className="eal-reason-num eal-display">03</span>
                <h3>Un evento serio</h3>
                <p>Reglamento general escrito, tres jueces por atleta y un código de conducta con descalificación inmediata. Tu marca queda asociada a una competencia bien organizada.</p>
              </article>
            </div>

            <div className="eal-tiers">
              {TIERS.map(t => (
                <article key={t.name} className={`eal-tier${t.featured ? ' is-featured' : ''}`}>
                  <span className="eal-tier-name">{t.name}</span>
                  <strong className="eal-display eal-tier-price">{t.price}</strong>
                  <span className="eal-tier-spots">{t.spots}</span>
                  <ul>{t.perks.map(p => <li key={p}>{p}</li>)}</ul>
                </article>
              ))}
            </div>

            <div className="eal-past-sponsors">
              <span>Nos acompañaron en ediciones anteriores</span>
              <ul>{PAST_SPONSORS.map(n => <li key={n} className="eal-display">{n}</li>)}</ul>
            </div>

            <div className="eal-sponsor-box">
              <div className="eal-sponsor-copy">
                <h3 className="eal-display">Armemos tu participación</h3>
                <p>Elige un nivel o propón el tuyo: efectivo, producto o una combinación. Déjanos tus datos y te enviamos la propuesta completa.</p>
                <a href={WA_SPONSOR} target="_blank" rel="noopener noreferrer" className="eal-link">
                  ¿Prefieres WhatsApp? Escríbenos al {EVENT.whatsappLabel} →
                </a>
                <a href={EVENT.instagramUrl} target="_blank" rel="noopener noreferrer" className="eal-link">
                  Mira las ediciones anteriores en Instagram {EVENT.instagram} →
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
            {EVENT.showRemaining ? (
              <h2 className="eal-display">Solo quedan {LEFT.elite} cupos en Élite<br /><span className="eal-accent">y {LEFT.junior} en Alfa Junior.</span></h2>
            ) : (
              <h2 className="eal-display">Solo {N} cupos por categoría.<br /><span className="eal-accent">Asegura el tuyo.</span></h2>
            )}
            <a href="#inscripcion" className="eal-btn eal-btn-primary eal-btn-lg">Reservar mi cupo · ${EVENT.price}</a>
            <p className="eal-final-note">Los cupos se asignan por orden de pago confirmado.</p>
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
            <a href={EVENT.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram {EVENT.instagram}</a>
          </div>
        </div>
        <div className="eal-container eal-footer-legal">
          <a href="/privacidad">Política de privacidad</a>
          <a href="/exoneracion">Exoneración de responsabilidad</a>
          {EVENT.reglamentoUrl ? <a href={EVENT.reglamentoUrl} target="_blank" rel="noopener noreferrer">Reglamento</a> : <span>Reglamento · próximamente</span>}
        </div>
      </footer>

      {/* CTA fijo en móvil */}
      <StickyCta label={`Quiero competir · $${EVENT.price}`} />
    </>
  );
}
