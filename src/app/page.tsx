'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // Observer for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Pricing />
        <Testimonials />
        <FAQ />
        
        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-overlay"></div>
          <div className="container cta-content fade-in-up">
            <h2 className="cta-title">Solo hay dos opciones hoy.</h2>
            <p className="cta-desc">
              Cierras esta página y mañana vuelves a entrenar con dudas, o entras a Zenkai Academy, te rodeas de gente que te impulsa a mejorar y empiezas a construir un físico y una mentalidad reales. Tú decides.
            </p>
            <Link href="/register" className="btn btn-primary btn-large" suppressHydrationWarning>
              Entrar a Zenkai Academy hoy
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
