import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page" style={{ paddingTop: '100px', paddingBottom: '4rem', background: 'var(--bg-color)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="section-title text-left" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Términos y Condiciones</h1>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar los servicios de Zenkai Academy, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Servicios de Mentoría y Entrenamiento</h2>
            <p>Zenkai Academy ofrece planes de entrenamiento funcional y mentoría. Los resultados varían según el compromiso individual, la genética y otros factores. No garantizamos resultados específicos. Usted asume la total responsabilidad de su salud y bienestar durante la ejecución de los entrenamientos.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Pagos y Suscripciones</h2>
            <p>Nuestros servicios se cobran mediante suscripción mensual. Puede cancelar su suscripción en cualquier momento sin penalización, lo cual detendrá futuros cobros, pero no habrá reembolsos prorrateados por el mes en curso.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Propiedad Intelectual</h2>
            <p>Todo el contenido proporcionado, incluidos videos, planes de nutrición y textos, es propiedad exclusiva de Zenkai Academy y no puede ser distribuido, vendido ni copiado sin nuestro consentimiento previo por escrito.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>5. Limitación de Responsabilidad</h2>
            <p>Consulte a su médico antes de comenzar cualquier programa de ejercicios. Zenkai Academy no se hace responsable de lesiones, problemas de salud o cualquier otro daño que resulte del uso de nuestros programas de entrenamiento.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
