import type { Metadata } from 'next';
import LegalPage from '@/components/endurance/LegalPage';

export const metadata: Metadata = {
  title: 'Política de privacidad | Endurance at the Limit',
  description: 'Qué datos recogemos en endurance.fortisworkout.org, para qué los usamos y cómo pedir que los borremos.',
};

const CONTACT = 'patrocinios@fortisworkout.org';

export default function PrivacidadPage() {
  return (
    <LegalPage eyebrow="Legal" title="Política de privacidad" updated="octubre de 2026">
      <p>
        Esta política explica qué datos personales recogen los organizadores de Endurance at the Limit a través de este sitio y de nuestros canales de inscripción, para qué los usamos y qué puedes pedirnos sobre ellos.
      </p>

      <h2>Qué datos recogemos</h2>
      <ul>
        <li><strong>Formulario de patrocinio:</strong> nombre, empresa o marca, correo, teléfono (opcional) y el mensaje que nos escribas.</li>
        <li><strong>Inscripción de atletas por WhatsApp:</strong> nombre completo, categoría, club, método de pago y el comprobante que nos envías.</li>
        <li><strong>Correos que nos escribes</strong> a nuestras direcciones de @fortisworkout.org.</li>
      </ul>
      <p>Este sitio no usa cookies de publicidad ni herramientas de seguimiento.</p>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Confirmar tu inscripción y organizar la competencia (listas por categoría, pases, jueceo).</li>
        <li>Responder tu solicitud de patrocinio y enviarte la propuesta.</li>
        <li>Enviarte correos sobre Endurance at the Limit. Cada correo trae un enlace para darte de baja con un clic.</li>
      </ul>
      <p>No vendemos ni cedemos tus datos a terceros.</p>

      <h2>Dónde se guardan</h2>
      <p>
        Usamos proveedores que procesan los datos por nosotros: Supabase (base de datos), Resend (envío y recepción de correos) y Netlify (alojamiento del sitio). Las inscripciones por WhatsApp quedan en ese chat. Guardamos los datos mientras sean necesarios para el evento y sus siguientes ediciones, o hasta que nos pidas borrarlos.
      </p>

      <h2>Fotos y video del evento</h2>
      <p>
        Durante la competencia se toman fotos y videos que podemos publicar en este sitio y en nuestras redes. Si no quieres aparecer en una publicación, escríbenos y la retiramos.
      </p>

      <h2>Qué puedes pedirnos</h2>
      <p>
        Puedes pedirnos ver, corregir o borrar tus datos, o dejar de recibir correos, escribiendo a <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Respondemos en un plazo máximo de 15 días.
      </p>

      <h2>Cambios</h2>
      <p>Si cambiamos esta política, publicamos la nueva versión en esta página con su fecha.</p>
    </LegalPage>
  );
}
