'use client';

import { useState } from 'react';

const testimonials = [
  {
    name: 'Andrés M.',
    age: 28,
    location: 'Caracas, Venezuela',
    duration: '4 meses en Zenkai',
    quote: 'Llegué sin poder hacer una sola dominada. Mi entrenador anterior me decía que la calistenia "no era para mi cuerpo". En 4 meses con el equipo Zenkai hice mi primera muscle up. No fue magia, fue que por primera vez alguien me corrigió en tiempo real y me dijo exactamente qué me faltaba. Si estás dudando, deja de perder tiempo como yo lo hice durante 2 años.',
    metric: 'De 0 dominadas → Muscle Up en 4 meses',
    highlight: 'Muscle Up',
    initials: 'AM',
  },
  {
    name: 'Isabella R.',
    age: 24,
    location: 'Medellín, Colombia',
    duration: '6 meses en Zenkai',
    quote: 'Siempre pensé que la calistenia era solo para hombres. Entré con miedo y con cero fuerza en los brazos. Lo que me enganchó fue la comunidad: no te juzga nadie, y los coaches adaptan todo al nivel en el que estés. Hoy hago handstands contra la pared y me siento más fuerte que nunca. Mis amigas del gimnasio no lo pueden creer.',
    metric: 'De no poder sostenerse → Handstand en 6 meses',
    highlight: 'Handstand',
    initials: 'IR',
  },
  {
    name: 'Carlos D.',
    age: 35,
    location: 'Ciudad de México',
    duration: '3 meses en Zenkai',
    quote: 'Tengo 35 años, trabajo 10 horas al día y mi espalda era un desastre. Probé 4 apps, 2 entrenadores locales, nada funcionaba porque nadie me ajustaba el programa a MIS problemas. Con Zenkai, el equipo me evaluó, ajustó mi rutina de movilidad y en 3 meses mi dolor de espalda desapareció. La mentoría 1 a 1 vale cada centavo.',
    metric: 'Dolor crónico de espalda → 0 dolor en 3 meses',
    highlight: '0 dolor',
    initials: 'CD',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="testimonials" id="testimonios">
      <div className="container">
        <span className="testimonials-pretitle fade-in">Resultados reales de personas reales</span>
        <h2 className="section-title fade-in" style={{ marginBottom: '1rem' }}>
          Ellos dejaron de <span className="highlight" style={{ fontSize: 'inherit' }}>dudar.</span>
        </h2>
        <p className="testimonials-subtitle fade-in">
          No te lo contamos nosotros. Te lo cuentan ellos.
        </p>

        {/* Desktop: Cards Grid */}
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card fade-in-up">
              {/* Metric Badge */}
              <div className="testimonial-metric">
                <span className="metric-highlight">{t.highlight}</span>
                <span className="metric-text">{t.metric}</span>
              </div>

              {/* Quote */}
              <blockquote className="testimonial-quote">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {t.initials}
                </div>
                <div className="testimonial-info">
                  <strong className="testimonial-name">{t.name}</strong>
                  <span className="testimonial-meta">{t.age} años · {t.location}</span>
                  <span className="testimonial-duration">{t.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="testimonials-mobile">
          <div className="testimonial-card-mobile">
            <div className="testimonial-metric">
              <span className="metric-highlight">{testimonials[activeIndex].highlight}</span>
              <span className="metric-text">{testimonials[activeIndex].metric}</span>
            </div>
            <blockquote className="testimonial-quote">
              &ldquo;{testimonials[activeIndex].quote}&rdquo;
            </blockquote>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {testimonials[activeIndex].initials}
              </div>
              <div className="testimonial-info">
                <strong className="testimonial-name">{testimonials[activeIndex].name}</strong>
                <span className="testimonial-meta">{testimonials[activeIndex].age} años · {testimonials[activeIndex].location}</span>
                <span className="testimonial-duration">{testimonials[activeIndex].duration}</span>
              </div>
            </div>
          </div>
          <div className="testimonials-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver testimonio ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
