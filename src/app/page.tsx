import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ScrollAnimations from '@/components/ScrollAnimations';

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollAnimations />
      
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Testimonials />
        <Pricing />

        {/* Guarantee Section */}
        <section className="guarantee-section">
          <div className="container">
            <div className="guarantee-card fade-in">
              <div className="guarantee-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <h3 className="guarantee-title">Sin contratos. Sin permanencia. Sin trampa.</h3>
              <p className="guarantee-desc">
                Cancela en cualquier momento con un solo mensaje. Pero eso no es todo: si en algún momento sientes que tu plan no está funcionando, nuestro equipo se sienta contigo, ajusta tu rutina y tu nutrición hasta que veas los resultados. No te dejamos solo.
              </p>
            </div>
          </div>
        </section>

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
              Tomo el control hoy
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
