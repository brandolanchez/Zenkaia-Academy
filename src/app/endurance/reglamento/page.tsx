import type { Metadata } from 'next';
import LegalPage from '@/components/endurance/LegalPage';

export const metadata: Metadata = {
  title: 'Reglamento general | Endurance at the Limit',
  description:
    'Reglamento de Endurance at the Limit 2026: categorías, inscripción, formato por tiempo, ejecución válida de cada ejercicio, jueceo, reclamos y premios.',
};

const AUTORIZACION = '/docs/endurance-autorizacion-representante-2026.pdf';

export default function ReglamentoPage() {
  return (
    <LegalPage eyebrow="Atletas" title="Reglamento general" updated="octubre de 2026">
      <p>
        Este reglamento aplica a todos los atletas inscritos en Endurance at the Limit 2026, 3.ª edición, en las dos categorías. Al inscribirte lo aceptas, junto con la <a href="/exoneracion">exoneración de responsabilidad</a>. Los criterios de ejecución siguen los usados en las competencias de resistencia avaladas por la Federación Española de Street Workout y Calistenia (FESWC).
      </p>

      <h2>1. Categorías</h2>
      <ul>
        <li><strong>Élite:</strong> la categoría de mayor nivel. El primer lugar recibe el título de Campeón de resistencia del Zulia y lo defiende en las ediciones siguientes, hasta un máximo de cuatro.</li>
        <li><strong>Alfa Junior:</strong> para quienes están empezando a competir. El primer lugar recibe el título de Atleta Revelación.</li>
        <li>Hay 20 cupos por categoría. Si entrenas en Fortis Workout, tu categoría la decide tu capitán; si vienes de otro club o del interior, la eliges tú según tu nivel.</li>
      </ul>

      <h2>2. Edad y menores de edad</h2>
      <ul>
        <li>La edad mínima para competir es de 15 años.</li>
        <li>Si tienes entre 15 y 17 años, te presentas el día del evento con tu representante legal y entregas la <a href={AUTORIZACION} target="_blank" rel="noopener">autorización del representante (PDF)</a> llena y firmada. Sin representante presente o sin autorización, no puedes competir.</li>
      </ul>

      <h2>3. Inscripción</h2>
      <ul>
        <li>La inscripción cuesta $20, por Pago Móvil (en bolívares, a tasa euro BCV) o 20 USDT por Binance Pay.</li>
        <li>Tu cupo queda reservado cuando la organización confirma tu comprobante por WhatsApp. Los cupos se asignan en ese orden, y cuando una categoría se llena, se cierra.</li>
        <li>Tu inscripción incluye la entrada para 3 acompañantes.</li>
      </ul>

      <h2>4. Llegada y chequeo</h2>
      <ul>
        <li>Llega una hora antes del inicio. El equipo de protocolo verifica tu inscripción y te entrega tu pase.</li>
        <li>Antes de competir pasas un chequeo médico. Si el equipo médico detecta un riesgo para tu salud, puede indicar que no compitas.</li>
        <li>Si no estás a la hora del chequeo, quedas descalificado.</li>
      </ul>

      <h2>5. Formato</h2>
      <ul>
        <li>Cada ronda es un circuito de bloques con repeticiones fijas y un orden que no se puede cambiar. Los circuitos de cada ronda están publicados en la sección <a href="/#circuitos">Formato</a>.</li>
        <li>Todas las rondas son por tiempo: avanza, y en la final gana, quien completa el circuito en menos tiempo con todas sus repeticiones válidas.</li>
        <li><strong>Élite:</strong> en la clasificatoria compiten todos los inscritos y los 10 mejores tiempos pasan a la segunda ronda. De ahí, los 3 mejores pasan a la final.</li>
        <li><strong>Alfa Junior:</strong> en la clasificatoria compiten todos los inscritos y los 3 mejores tiempos pasan directo a la final.</li>
        <li>El orden de llegada en la final define el podio.</li>
      </ul>

      <h2>6. Tiempo y descansos</h2>
      <ul>
        <li>El tiempo arranca con la señal del árbitro principal y se detiene con la última repetición válida del último bloque.</li>
        <li>Cada ronda tiene un tiempo límite de 20 minutos. Si se cumple sin que termines el circuito, tu ronda termina ahí y quedas por detrás de todos los que sí lo completaron, ordenado según el bloque y las repeticiones válidas a los que llegaste.</li>
        <li>Si dos atletas registran el mismo tiempo, gana quien tenga menos repeticiones anuladas en la ronda.</li>
        <li>El descanso entre rondas lo define el equipo organizador sobre la marcha, según el ritmo de la competencia y los tiempos del lugar. Lo anunciamos antes de cada ronda, para que todos los atletas lleguen con el mismo margen de recuperación.</li>
      </ul>

      <h2>7. Ejecución válida</h2>
      <p>En todos los ejercicios de barra y paralelas las piernas van juntas y rectas, sin cruzarlas, sin balanceo y sin kipping (impulso de cadera o piernas).</p>

      <h3>Pull ups y chin ups</h3>
      <ul>
        <li>Cada repetición arranca colgado con los brazos completamente extendidos: hay que bloquear abajo antes de volver a subir.</li>
        <li>La barbilla pasa por encima de la barra, sin echar el cuello hacia atrás más de 45°.</li>
        <li>Los dos brazos suben a la vez. Pull up con agarre prono (palmas al frente); chin up con agarre supino (palmas hacia ti).</li>
      </ul>

      <h3>Dips y bar dips</h3>
      <ul>
        <li>El fondo es estricto: se baja hasta que los codos lleguen a 90°, con el brazo paralelo al suelo, y se bloquea arriba con los brazos extendidos.</li>
        <li>Los dos hombros bajan a la vez y al mismo ángulo, sin inclinar el tronco de más para acortar el recorrido y sin rebotar.</li>
      </ul>

      <h3>Push ups</h3>
      <ul>
        <li>El cuerpo forma una línea recta de los pies a la cabeza, sin hundir ni subir la cadera.</li>
        <li>Se baja hasta que los codos lleguen a 90° (el pecho toca el puño del juez) y se vuelve a brazos extendidos.</li>
        <li>No valen con los dedos flexionados, ni apoyado en un bordillo, una barra o una superficie inclinada.</li>
      </ul>

      <h3>Squats</h3>
      <ul>
        <li>Se baja hasta que los muslos queden paralelos al suelo y se sube hasta extender por completo cadera y rodillas.</li>
        <li>Los talones no se despegan del suelo, sin rebotar abajo y sin apoyar las manos en las rodillas.</li>
      </ul>

      <h3>Muscle ups</h3>
      <ul>
        <li>De colgado a brazos extendidos sobre la barra, con bloqueo arriba. Los dos brazos pasan a la vez: subir primero uno y luego el otro no cuenta.</li>
        <li>En Élite, en la clasificatoria y la segunda ronda, no se permite encoger las piernas. En la final el jurado es más flexible con la forma, por el cansancio acumulado.</li>
      </ul>

      <h3>Burpees</h3>
      <ul>
        <li>Bajas a posición de flexión con los brazos extendidos y el cuerpo recto. El pecho no toca el suelo: te mantienes en tensión.</li>
        <li>Vuelves a pararte y saltas con los brazos extendidos arriba. Tirarse al suelo anula la repetición.</li>
      </ul>

      <h3>Leg raises</h3>
      <ul>
        <li>Colgado de la barra, con los brazos extendidos, subes las piernas juntas y rectas hasta 90° respecto al tronco, paralelas al suelo.</li>
        <li>Doblar las rodillas o tomar impulso del balanceo anula la repetición.</li>
      </ul>

      <h3>Chin over the bar</h3>
      <ul>
        <li>Sostienes la barbilla por encima de la barra el tiempo indicado en el circuito.</li>
        <li>Si la barbilla baja de la barra, el conteo se pausa y sigue cuando vuelves a subirla.</li>
      </ul>

      <h2>8. Repeticiones nulas y descalificación</h2>
      <ul>
        <li>Toda repetición que no cumple la ejecución válida es nula y se repite antes de seguir. El árbitro la anula en el momento.</li>
        <li>Saltarse un bloque, o hacer uno completo con mala ejecución, puede costar la descalificación.</li>
        <li>Cualquier falta de conducta con otro atleta, el jurado, el público o la organización se sanciona con descalificación inmediata.</li>
      </ul>

      <h2>9. Lastre, magnesio e implementos</h2>
      <ul>
        <li>La organización pone el lastre de los bloques con peso, según lo indicado en cada circuito, y el magnesio.</li>
        <li>Compites con la franela de tu club. Cualquier otro implemento se avisa con al menos 15 días de anticipación para que el jurado lo apruebe.</li>
      </ul>

      <h2>10. Lesiones y condiciones</h2>
      <p>
        Si tienes una lesión o una condición en las articulaciones, avisa a la organización con al menos 15 días de anticipación y a los jueces antes de empezar. Los jueces evalúan tu caso para no anular repeticiones que, por esa condición, no puedes ejecutar exactamente igual.
      </p>

      <h2>11. Jueceo</h2>
      <ul>
        <li><strong>Árbitro principal:</strong> evalúa la técnica, aplica las penalizaciones y registra tu resultado.</li>
        <li><strong>Árbitro ayudante:</strong> cuenta tus repeticiones, verifica que sean válidas y te guía en el orden del circuito.</li>
        <li><strong>Mesa técnica:</strong> registra tu ejecución.</li>
      </ul>

      <h2>12. Reclamos y revisión de resultados</h2>
      <ul>
        <li>Puedes pedir la revisión de tu resultado, de una repetición anulada o de una descalificación al terminar tu ronda, nunca durante ella, y antes de que empiece la siguiente.</li>
        <li>El reclamo lo revisa el comité de jueces en conjunto: el árbitro principal, el árbitro ayudante y la mesa técnica, con el registro de la ronda.</li>
        <li>El comité se dirige al atleta y le explica el fundamento de su decisión: qué repetición se anuló y por qué, o el motivo de la descalificación. Esa decisión es final.</li>
      </ul>

      <h2>13. Premios</h2>
      <p>
        En cada categoría: $100 al 1.er lugar, $80 al 2.º y $50 al 3.º, en efectivo, más medalla y trofeo para los ganadores.
      </p>

      <h2>14. Imagen</h2>
      <p>
        La organización puede usar fotos y videos del evento para difundir Endurance at the Limit, según lo que establece la <a href="/exoneracion">exoneración de responsabilidad</a>.
      </p>
    </LegalPage>
  );
}
