'use client';

import { useState } from 'react';
import { faqs } from './faqData';

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
