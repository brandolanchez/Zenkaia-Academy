import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import MobileStickyCta from '@/components/MobileStickyCta';
import s from './efm.module.css';

const SITE = 'https://zenkai.fortisworkout.org';
const PAGE_URL = `${SITE}/entrenamiento-funcional-maracaibo`;
const WHATSAPP = 'https://wa.me/584127862283?text=' + encodeURIComponent('Hola, quiero información sobre el entrenamiento funcional de Zenkai.');

export const metadata: Metadata = {
  title: 'Entrenamiento funcional en Maracaibo | Zenkai Academy',
  description:
    'Entrenamiento funcional en Maracaibo con calistenia, presencial u online. Coaches que corrigen tu técnica y un plan a tu nivel. Desde $47/mes, sin contratos.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Entrenamiento funcional en Maracaibo | Zenkai Academy',
    description: 'Presencial u online, con coaches que corrigen tu técnica. Desde $47/mes, sin contratos.',
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: '¿Las sesiones son presenciales o en línea?',
    a: 'Las dos cosas. Si estás en Maracaibo puedes entrenar en persona con tu coach, y si no puedes ir, sigues el mismo plan en línea: rutinas en la plataforma, corrección de técnica en video y sesiones por Google Meet. Escríbenos por WhatsApp y te contamos cómo se organizan las presenciales.',
  },
  {
    q: '¿Necesito experiencia para empezar?',
    a: 'No. Antes de darte el plan hacemos una evaluación de tu nivel. Si hoy no puedes hacer una flexión o una dominada, empiezas con la versión que sí puedes hacer bien y vas subiendo.',
  },
  {
    q: '¿Qué equipo necesito para el entrenamiento funcional?',
    a: 'Lo básico es tu cuerpo. Para avanzar en tracción conviene una barra de dominadas, o un parque con barras y paralelas. Tu coach te dice qué necesitas según dónde vas a entrenar.',
  },
  {
    q: '¿Cuántos días a la semana hay que entrenar?',
    a: 'Entre 3 y 5 días, de 45 a 60 minutos. Con tres sesiones bien hechas a la semana ya se notan cambios en fuerza y resistencia.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Entrenamiento funcional en Maracaibo',
      serviceType: 'Entrenamiento funcional y calistenia, presencial y online',
      url: PAGE_URL,
      provider: { '@id': `${SITE}/#org` },
      areaServed: { '@type': 'City', name: 'Maracaibo' },
      offers: [
        { '@type': 'Offer', name: 'Plan Standard', price: '47', priceCurrency: 'USD', url: `${SITE}/#planes` },
        { '@type': 'Offer', name: 'Plan Élite', price: '97', priceCurrency: 'USD', url: `${SITE}/#planes` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Zenkai Academy', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Entrenamiento funcional en Maracaibo', item: PAGE_URL },
      ],
    },
  ],
};

export default function EntrenamientoFuncionalMaracaibo() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className={s.page}>
        {/* Portada */}
        <section className={s.hero}>
          <div className={`container ${s.heroGrid}`}>
            <div>
            <span className={s.kicker}>Presencial u online</span>
            <h1 className={s.h1}>Entrenamiento funcional en Maracaibo</h1>
            <p className={s.lead}>
              Zenkai es la academia de entrenamiento funcional y calistenia que nació en la comunidad de Fortis Workout. Entrenas con un coach que te conoce, en persona en Maracaibo o en línea, con un plan hecho a tu nivel y alguien que te corrige la técnica.
            </p>
            <div className={s.actions}>
              <Link href="/#planes" className="btn btn-primary btn-large">Ver planes y precios</Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={s.textLink}>Preguntar por WhatsApp</a>
            </div>
            </div>
            <figure className={s.photo}>
              <Image
                src="/images/images/photo_35_2026-07-06_10-49-54.jpg"
                alt="Alumno de Zenkai haciendo flexiones en un entrenamiento funcional en Maracaibo"
                width={1280}
                height={960}
                priority
                sizes="(max-width: 900px) 100vw, 520px"
              />
            </figure>
          </div>
        </section>

        {/* Qué es */}
        <section className={s.section}>
          <div className={`container ${s.narrow}`}>
            <h2 className={s.h2}>Qué es el entrenamiento funcional (y qué no es)</h2>
            <p className={s.p}>
              Entrenamiento funcional es entrenar los movimientos que tu cuerpo hace todos los días, para hacerlos con más fuerza, más control y menos riesgo de lesionarte. No es hacer cualquier circuito hasta quedar empapado de sudor: es trabajar patrones de movimiento con una progresión clara.
            </p>
            <ul className={s.list}>
              <li><strong>Empujar:</strong> levantarte del suelo, mover algo pesado.</li>
              <li><strong>Jalar:</strong> subirte a algo, cargar una bolsa desde abajo.</li>
              <li><strong>Agacharte y levantarte:</strong> sentadillas, recoger peso del suelo.</li>
              <li><strong>Estabilizar el tronco:</strong> mantener la postura mientras cargas o giras.</li>
              <li><strong>Desplazarte:</strong> saltar, cambiar de dirección, aguantar el ritmo.</li>
            </ul>
            <p className={s.p}>
              Si mejoras esos cinco patrones, mejoras casi todo lo demás: subir escaleras, cargar a tus hijos, jugar un partido o rendir en tu trabajo sin terminar el día molido.
            </p>
          </div>
        </section>

        {/* Por qué calistenia */}
        <section className={s.section}>
          <div className={`container ${s.narrow}`}>
            <h2 className={s.h2}>Por qué lo hacemos con calistenia</h2>
            <p className={s.p}>
              La calistenia es entrenamiento funcional en su forma más directa: tu cuerpo es la carga. No dependes de máquinas, puedes entrenar casi en cualquier lugar y siempre hay un paso siguiente para progresar.
            </p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th>Patrón</th><th>Empiezas con</th><th>Llegas a</th></tr>
                </thead>
                <tbody>
                  <tr><td>Empuje</td><td>Flexiones inclinadas</td><td>Fondos en paralelas, flexiones arqueras</td></tr>
                  <tr><td>Tracción</td><td>Remo australiano</td><td>Dominadas, muscle up</td></tr>
                  <tr><td>Pierna</td><td>Sentadilla a una caja</td><td>Sentadilla búlgara, pistol squat</td></tr>
                  <tr><td>Tronco</td><td>Plancha</td><td>L-sit, elevaciones de piernas en barra</td></tr>
                  <tr><td>Resistencia</td><td>Circuitos cortos</td><td>Circuitos por tiempo con todo lo anterior</td></tr>
                </tbody>
              </table>
            </div>
            <p className={s.p}>
              Primero aprendes a controlar tu propio peso. Si más adelante quieres sumar carga externa, llegas con una base que te protege.
            </p>
          </div>
        </section>

        {/* Presencial u online */}
        <section className={s.section}>
          <div className="container">
            <h2 className={s.h2}>Presencial u online: tú eliges</h2>
            <p className={s.p} style={{ maxWidth: 760 }}>El método es el mismo. Cambia dónde te corrige tu coach.</p>
            <div className={s.grid3}>
              <figure className={`${s.photo} ${s.photoTall}`}>
                <Image
                  src="/images/images/photo_5.webp"
                  alt="Sesión presencial de entrenamiento funcional de Zenkai en Maracaibo"
                  width={960}
                  height={1280}
                  sizes="(max-width: 900px) 100vw, 380px"
                />
              </figure>
              <div className={`${s.box} ${s.boxAccent}`}>
                <span className={s.tag}>En Maracaibo</span>
                <h3 className={s.h3}>Sesiones presenciales</h3>
                <p className={s.p}>Tu coach te ve entrenar en persona, te corrige en el momento y ajusta la carga de la sesión según cómo llegas ese día. Es la forma más rápida de aprender la técnica.</p>
              </div>
              <div className={`${s.box} ${s.boxAccent}`}>
                <span className={s.tag}>Desde donde estés</span>
                <h3 className={s.h3}>Sesiones en línea</h3>
                <p className={s.p}>Tienes tu rutina en la plataforma con videos de cada ejercicio, nos envías tus videos para revisar la técnica y te unes a las sesiones por Google Meet. Sirve si viajas, si tu horario cambia o si no vives en Maracaibo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Semana de ejemplo */}
        <section className={s.section}>
          <div className="container">
            <h2 className={s.h2}>Una semana de entrenamiento funcional, de ejemplo</h2>
            <p className={s.p} style={{ maxWidth: 760 }}>
              Así puede verse una semana de tres días para alguien que empieza. Tu plan real lo arma tu coach después de la evaluación, con los ejercicios y repeticiones de tu nivel.
            </p>
            <div className={s.grid3}>
              <div className={s.box}>
                <span className={s.tag}>Día 1</span>
                <h3 className={s.h3}>Empuje y pierna</h3>
                <ul className={s.list}>
                  <li>Flexiones inclinadas</li>
                  <li>Sentadilla a una caja</li>
                  <li>Zancadas alternas</li>
                  <li>Plancha</li>
                </ul>
              </div>
              <div className={s.box}>
                <span className={s.tag}>Día 2</span>
                <h3 className={s.h3}>Tracción y tronco</h3>
                <ul className={s.list}>
                  <li>Remo australiano</li>
                  <li>Colgarse de la barra</li>
                  <li>Puente de glúteo</li>
                  <li>Elevaciones de rodillas</li>
                </ul>
              </div>
              <div className={s.box}>
                <span className={s.tag}>Día 3</span>
                <h3 className={s.h3}>Circuito completo</h3>
                <ul className={s.list}>
                  <li>Burpees sin salto</li>
                  <li>Flexiones</li>
                  <li>Sentadillas</li>
                  <li>Remo australiano</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Para quién */}
        <section className={s.section}>
          <div className={`container ${s.splitGrid}`}>
            <div>
            <h2 className={s.h2}>Para quién es</h2>
            <ul className={s.list}>
              <li><strong>Si nunca has entrenado:</strong> empiezas desde tu nivel real, sin hacer el ridículo ni lesionarte.</li>
              <li><strong>Si ya entrenas y te estancaste:</strong> un coach ve lo que tú no ves en tu técnica y en tu plan.</li>
              <li><strong>Si tienes poco tiempo:</strong> sesiones de 45 a 60 minutos, 3 a 5 veces por semana.</li>
              <li><strong>Si pasaste los 40:</strong> adaptamos el programa a tus articulaciones y a lo que tu cuerpo tolera hoy.</li>
            </ul>
            </div>
            <figure className={`${s.photo} ${s.photoTall}`}>
              <Image
                src="/images/images/photo_16_2026-07-06_10-49-54.jpg"
                alt="Atleta de Zenkai preparándose con magnesio antes de entrenar calistenia"
                width={960}
                height={1280}
                sizes="(max-width: 900px) 100vw, 400px"
              />
            </figure>
          </div>
        </section>

        <Testimonials />

        {/* Precios */}
        <section className={s.section}>
          <div className="container">
            <h2 className={s.h2}>Cuánto cuesta</h2>
            <div className={s.grid2}>
              <div className={s.box}>
                <span className={s.tag}>Standard</span>
                <p className={s.price}>$47<span>/mes</span></p>
                <p className={s.p}>Rutinas en video, plan nutricional, corrección grupal 3 veces por semana y evaluación trimestral.</p>
              </div>
              <div className={`${s.box} ${s.boxAccent}`}>
                <span className={s.tag}>Élite</span>
                <p className={s.price}>$97<span>/mes</span></p>
                <p className={s.p}>Revisión de técnica 1 a 1, todas las sesiones grupales, nutrición avanzada y evaluación mensual.</p>
              </div>
            </div>
            <p className={s.p} style={{ marginTop: '1.5rem' }}>
              Sin contratos: cancelas cuando quieras. Para sesiones presenciales en Maracaibo, <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={s.textLink}>escríbenos por WhatsApp</a>.
            </p>
            <div className={s.actions}>
              <Link href="/#planes" className="btn btn-primary">Ver detalle de los planes</Link>
            </div>
          </div>
        </section>

        {/* Preguntas */}
        <section className={s.section}>
          <div className={`container ${s.narrow}`}>
            <h2 className={s.h2}>Preguntas frecuentes</h2>
            <div className={s.faq}>
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className={s.cta}>
          <div className="container">
            <h2 className={s.h2}>Empieza esta semana</h2>
            <p className={s.p}>Te evaluamos, te armamos el plan y en tu primera sesión ya sabes exactamente qué hacer.</p>
            <Link href="/register" className="btn btn-primary btn-large">Quiero empezar</Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
