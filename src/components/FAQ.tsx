'use client';

import { useState } from 'react';

const faqs = [
  {
    question: '¿No tengo fuerza en los brazos, esto es para mí?',
    answer: 'Sí, 100%. La mayoría de nuestros alumnos empiezan sin poder hacer una sola dominada. Zenkai no es un programa para atletas, es un programa para personas que quieren convertirse en uno. Nuestro equipo adapta cada rutina a tu nivel actual, desde el movimiento más básico hasta progresiones avanzadas. No necesitas fuerza, necesitas empezar.',
  },
  {
    question: '¿Cuánto tiempo al día necesito?',
    answer: 'Entre 45 y 60 minutos, de 3 a 5 veces por semana. No necesitas vivir en el gimnasio. Nuestras rutinas están diseñadas para personas con trabajos reales y agendas apretadas. Lo importante no es entrenar 3 horas, es entrenar bien. Y para eso tienes a nuestros coaches corrigiéndote en las mentorías.',
  },
  {
    question: '¿Necesito equipo o un gimnasio?',
    answer: 'Lo mínimo: una barra de dominadas. Lo ideal: acceso a un parque de calistenia o gimnasio con barra y paralelas. Muchos ejercicios se pueden hacer en casa con cero equipo. En tu evaluación inicial, un coach te dice exactamente qué necesitas según tu situación.',
  },
  {
    question: '¿Qué diferencia hay entre el plan Standard y el Élite?',
    answer: 'Ambos planes incluyen la plataforma con las rutinas en video y tu plan nutricional. La diferencia está en el seguimiento. En Standard te unes a los Google Meets grupales (3 veces por semana) para resolver dudas y revisar técnica en grupo. En Élite la atención es 1 a 1: nos envías videos de tus entrenamientos y te corregimos la técnica personalmente, para que avances con menos riesgo de lesionarte. Además, Élite incluye los Protocolos de Mentalidad Inquebrantable y una evaluación física mensual.',
  },

  {
    question: '¿En qué se diferencia Zenkai de una app de ejercicios?',
    answer: 'Una app te da un video genérico y te deja solo. Zenkai te da un sistema con un coach real que te mira, te corrige y te empuja. Una app no sabe si estás haciendo mal un movimiento, no te pregunta cómo te sientes hoy y no te ajusta la rutina cuando te molesta el hombro. Nosotros sí.',
  },
  {
    question: '¿Sirve si tengo más de 30 años o alguna lesión?',
    answer: 'Sí. La mayoría de nuestros alumnos tienen entre 25 y 40 años, y también entrenan personas mayores. Varios llegaron con molestias de espalda, hombros o rodillas. En el plan Élite evaluamos tu movilidad y adaptamos el programa a lo que tu cuerpo tolera hoy. Si tienes una lesión activa, consulta primero con tu médico y cuéntanos su indicación en la evaluación.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="container">
        <span className="faq-pretitle fade-in">Todas tus dudas, resueltas</span>
        <h2 className="section-title fade-in" style={{ marginBottom: '1rem' }}>
          Preguntas <span className="highlight" style={{ fontSize: 'inherit' }}>Frecuentes</span>
        </h2>
        <p className="faq-subtitle fade-in">Lo que más nos preguntan antes de empezar.</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                id={`faq-question-${index}`}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              <div 
                className="faq-answer"
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact fade-in">
          <p>¿Tu duda no está aquí?</p>
          <a href="https://wa.me/584127862283" target="_blank" rel="noopener noreferrer" className="btn btn-outline faq-whatsapp">
            Escríbele a un coach por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
