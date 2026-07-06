'use client';

import { useState } from 'react';

const testimonials = [
  {
    name: 'Andrés M.',
    age: 28,
    duration: '10 meses en Zenkai',
    quote: 'Entrenaba en piloto automático y mi cuerpo no cambiaba. En Zenkai ajustaron mi entrenamiento y por primera vez en mi vida me veo al espejo y noto los resultados reales. Dejé de perder el tiempo.',
    metric: 'De estancado a ganar músculo magro',
    highlight: '+ MÚSCULO',
    initials: 'AM',
  },
  {
    name: 'Dixamary',
    age: 28,
    duration: '1 año y 3 meses en Zenkai',
    quote: 'Tenía cero fuerza y me sentía estancada. En 6 meses logré definir mi cuerpo, perder grasa y ganar una resistencia increíble. La diferencia fue tener un plan adaptado a mí y alguien corrigiéndome paso a paso.',
    metric: 'De 0 fuerza a dominar su propio peso',
    highlight: 'FUERZA REAL',
    initials: 'D',
  },
  {
    name: 'Carlos D.',
    age: 59,
    duration: '7 meses en Zenkai',
    quote: 'A mi edad pensaba que ya no podía recuperar mi agilidad. Tenía dolores articulares constantes. El equipo adaptó todo a mi nivel y hoy me muevo con la energía de hace 20 años sin riesgo de lesionarme. Nunca es tarde.',
    metric: 'Recuperó movilidad y energía sin lesiones',
    highlight: 'VITALIDAD',
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
                <div className="testimonial-info">
                  <strong className="testimonial-name">{t.name}</strong>
                  <span className="testimonial-meta">{t.age} años</span>
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
              <div className="testimonial-info">
                <strong className="testimonial-name">{testimonials[activeIndex].name}</strong>
                <span className="testimonial-meta">{testimonials[activeIndex].age} años</span>
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
