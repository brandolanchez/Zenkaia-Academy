import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="legal-page" style={{ paddingTop: '100px', paddingBottom: '4rem', background: 'var(--bg-color)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="section-title text-left" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Políticas de Privacidad</h1>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>1. Información que recopilamos</h2>
            <p>Recopilamos información personal que usted nos proporciona directamente al registrarse, como su nombre, correo electrónico, y datos de facturación. También podemos recopilar información sobre sus objetivos físicos y estado de salud para adaptar su programa.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>2. Uso de la información</h2>
            <p>Utilizamos su información para: proporcionar nuestros servicios de entrenamiento, procesar sus pagos, comunicarnos con usted sobre su cuenta o soporte, y personalizar su experiencia en la plataforma. No vendemos sus datos a terceros.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>3. Protección de datos</h2>
            <p>Implementamos medidas de seguridad para mantener la integridad de su información personal. Los pagos son procesados a través de proveedores seguros y certificados (como Stripe o equivalentes), por lo que Zenkai Academy no almacena los datos de su tarjeta de crédito.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>4. Cookies y Seguimiento</h2>
            <p>Podemos utilizar cookies y tecnologías similares (como el Píxel de Meta) para analizar el tráfico del sitio web y mostrarle publicidad relevante en otras plataformas (Facebook, Instagram, Google). Puede configurar su navegador para rechazar las cookies si lo desea.</p>

            <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem' }}>5. Sus Derechos</h2>
            <p>Usted tiene derecho a acceder, corregir o solicitar la eliminación de su información personal de nuestra base de datos. Para ejercer estos derechos, puede contactar a nuestro equipo de soporte.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
