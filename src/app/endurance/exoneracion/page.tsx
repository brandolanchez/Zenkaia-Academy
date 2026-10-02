import type { Metadata } from 'next';
import LegalPage from '@/components/endurance/LegalPage';

export const metadata: Metadata = {
  title: 'Exoneración de responsabilidad | Endurance at the Limit',
  description: 'Declaración de aptitud física y aceptación de riesgos para los atletas de Endurance at the Limit.',
};

export default function ExoneracionPage() {
  return (
    <LegalPage eyebrow="Atletas" title="Exoneración de responsabilidad y aceptación de riesgos" updated="octubre de 2026">
      <p>
        Endurance at the Limit es una competencia de resistencia de alta exigencia física. Antes de inscribirte, lee este documento. Al marcar la casilla de aceptación en la inscripción y enviar tu comprobante, declaras que lo leíste y lo aceptas. El día del evento lo firmas en el chequeo.
      </p>

      <h2>1. Aptitud física</h2>
      <p>
        Declaro que estoy en condiciones físicas y de salud para competir, que entreno de forma regular y que no tengo, hasta donde sé, ninguna condición médica que me impida hacer ejercicio de alta intensidad. Si tengo una lesión o una condición, la informo a la organización con al menos 15 días de anticipación y a los jueces antes de empezar.
      </p>

      <h2>2. Riesgos que asumo</h2>
      <p>
        Entiendo que la competencia incluye esfuerzo máximo, trabajo en barras y anillas, y series contra el reloj, y que esto implica riesgos como caídas, golpes, lesiones musculares, articulares o tendinosas, mareos y agotamiento. Participo de forma voluntaria y asumo esos riesgos.
      </p>

      <h2>3. Atención médica en el evento</h2>
      <ul>
        <li>Antes de competir paso un <strong>chequeo médico</strong>. Si ese chequeo detecta un riesgo para mi salud, el equipo médico puede indicar que no compita, y acepto esa decisión.</li>
        <li>Un <strong>equipo de primeros auxilios</strong> está en el lugar durante todo el evento y puede atenderme si lo necesito.</li>
        <li>Entiendo que los primeros auxilios no sustituyen la atención médica especializada. Si hace falta un traslado a un centro de salud, autorizo que se haga, y su costo corre por mi cuenta o la de mi seguro, si lo tengo.</li>
      </ul>

      <h2>4. Reglamento y jueceo</h2>
      <p>
        Me comprometo a cumplir el reglamento de la competencia y el código de conducta, y acepto las decisiones de los jueces. Sé que una falta de conducta o no presentarme a la hora del chequeo puede costarme la descalificación.
      </p>

      <h2>5. Exoneración</h2>
      <p>
        Exonero a los organizadores, jueces, voluntarios, patrocinadores y al lugar del evento de responsabilidad por lesiones o daños que sufra durante la competencia, salvo los que se deban a negligencia grave de su parte.
      </p>

      <h2>6. Pertenencias</h2>
      <p>La organización no se hace responsable por pérdida o daño de objetos personales.</p>

      <h2>7. Uso de imagen</h2>
      <p>
        Autorizo que se usen fotos y videos en los que aparezco durante el evento para difundir Endurance at the Limit en este sitio y en redes sociales, sin pago. Si no quiero aparecer en una publicación en particular, puedo pedir que la retiren.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        Si el atleta es menor de 18 años, su representante legal debe autorizar la inscripción y firmar este documento en el chequeo. Sin esa firma, el atleta no puede competir.
      </p>
    </LegalPage>
  );
}
