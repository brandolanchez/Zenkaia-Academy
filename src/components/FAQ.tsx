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
    question: '¿Qué diferencia hay entre el plan Standard y el Avanzado?',
    answer: 'En Standard tienes acceso a todos los videos, guías y mentorías grupales 3 veces por semana. Es perfecto para empezar. En Avanzado tienes todo eso más seguimiento 1 a 1 con nuestros coaches: revisan tus videos, corrigen tu técnica personalmente, te hacen una evaluación física y arman un plan de nutrición a tu medida. Es la diferencia entre entrenar solo y tener entrenadores de élite en tu bolsillo.',
  },
  {
    question: '¿Puedo cancelar cuando quiera?',
    answer: 'Sí. No hay contratos ni permanencias. Puedes cancelar tu suscripción en cualquier momento desde tu perfil. Sin preguntas, sin letras pequeñas. Pero te vamos a ser honestos: los que se quedan más de 3 meses nunca se van.',
  },
  {
    question: '¿En qué se diferencia Zenkai de una app de ejercicios?',
    answer: 'Una app te da un video genérico y te deja solo. Zenkai te da un sistema con un coach real que te mira, te corrige y te empuja. Las apps no saben si estás haciendo mal un movimiento. Las apps no te preguntan cómo te sientes hoy. Las apps no te adaptan la rutina cuando te duele el hombro. Nosotros sí.',
  },
  {
    question: '¿Sirve si tengo más de 30 años o alguna lesión?',
    answer: 'La mayoría de nuestros alumnos tienen entre 25 y 40 años. Varios llegaron con dolores crónicos de espalda, hombros o rodillas. En el plan Avanzado, nuestro equipo evalúa tu movilidad y adapta todo el programa para que entrenes SIN empeorar nada. De hecho, muchos han eliminado sus dolores con el trabajo de movilidad funcional que hacemos.',
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
        <p className="faq-subtitle fade-in">
          Si tu respuesta no está aquí, escríbenos directo por Instagram.
        </p>

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
      </div>
    </section>
  );
}
