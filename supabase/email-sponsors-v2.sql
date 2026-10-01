-- =====================================================================
-- Endurance · Secuencia de patrocinio v2
-- Ejecutar en Supabase > SQL Editor DESPUÉS de email-marketing.sql.
-- - Agrega la lógica de secuencia (enviar solo a quien recibió el correo
--   anterior hace X días).
-- - Reemplaza los 3 correos de prueba por la secuencia final:
--   4 primeros correos (uno por tipo de empresa) + 2 seguimientos.
-- Solo toca campañas en borrador. Se puede correr más de una vez.
-- =====================================================================

ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS after_campaigns UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS wait_days INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS email_sends_campaign_idx ON public.email_sends (campaign_id, status, created_at);

-- Borramos los borradores de la versión anterior (nunca se enviaron)
DELETE FROM public.email_campaigns
WHERE status = 'draft'
  AND name IN ('Sponsors 1/3 · Presentación', 'Sponsors 2/3 · Seguimiento', 'Sponsors 3/3 · Último correo')
  AND NOT EXISTS (SELECT 1 FROM public.email_sends s WHERE s.campaign_id = email_campaigns.id);

INSERT INTO public.email_campaigns (name, subject, preheader, audience_tag, sort_order, wait_days, body)
SELECT * FROM (VALUES
-- 1A · Gimnasios, suplementos, ropa deportiva, nutrición -----------------
(
  'Sponsors 1/3 · Fitness',
  '{{empresa|Tu marca}} en la competencia de calistenia del Zulia',
  '3ª edición de Endurance at the Limit: 40 atletas y $460 en premios. Buscamos pocas marcas.',
  'fitness', 1, 0,
$body$Hola {{nombre|}},

Soy Brando Lanchez, organizador de **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. La primera edición reunió a 30 atletas; para la 3ª abrimos 40 cupos en dos categorías y repartimos $460 en premios en efectivo.

Te escribo porque el público del evento es el tuyo: gente que entrena todas las semanas, compra suplementos y ropa deportiva y paga un gimnasio.

Trabajamos con pocas marcas por edición, para que cada una se vea. Puedes participar así:

- **Patrocinio de categoría ($150):** la categoría Élite o Alfa Junior lleva tu nombre y tú entregas los premios en el podio.
- **Aliado oficial ($50 o su equivalente en producto):** logo en el backdrop y en la web, y menciones durante el evento.
- **Aliado de premios:** productos, membresías o ropa para los ganadores, con mención en el podio y en redes.

En ediciones anteriores nos acompañaron Valhalla Fitness Center como sede y Nature con su té.

¿Te envío la propuesta completa? Basta con responder este correo.

Brando Lanchez
Endurance at the Limit · 0412-613-4013$body$
),
-- 1B · Comercio local: comida, bebidas, salud, servicios ------------------
(
  'Sponsors 1/3 · Comercio local',
  'Patrocinio local para {{empresa|tu negocio}}',
  'Una competencia de calistenia en Maracaibo, con opciones desde $50 o en especie.',
  'comercio', 2, 0,
$body$Hola {{nombre|}},

Soy Brando Lanchez, organizador de **Endurance at the Limit**, una competencia de resistencia en calistenia que se hace aquí en Maracaibo. Vamos por la 3ª edición: 40 atletas, tres jueces por atleta y $460 en premios en efectivo.

Cada atleta entra con tres acompañantes, así que el público del día es gente joven de la ciudad, activa y que sigue el deporte en redes.

No hace falta un presupuesto grande para estar:

- **Aliado oficial ($50):** tu logo en el backdrop y en la web, y menciones del animador durante el evento.
- **Aliado en especie:** comida, bebidas o servicios para atletas y jueces, con la misma visibilidad. Así nos acompañó Nature en la primera edición, con su té.
- Si buscas más presencia, el **patrocinio de categoría ($150)** pone tu nombre en los premios de Élite o Alfa Junior.

¿Te paso la propuesta? Responde este correo y te la envío.

Brando Lanchez
Endurance at the Limit · 0412-613-4013$body$
),
-- 1C · Marcas grandes / nacionales ----------------------------------------
(
  'Sponsors 1/3 · Marcas',
  'Endurance at the Limit, presentado por {{empresa|tu marca}}',
  'Buscamos un solo patrocinador principal para la 3ª edición.',
  'marca', 3, 0,
$body$Hola {{nombre|}},

Soy Brando Lanchez, organizador de **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. Vamos por la 3ª edición y buscamos un patrocinador principal.

El formato: circuitos de cinco ejercicios contra el reloj, una clasificación que ordena a los atletas y llaves cara a cara hasta la final. Son 40 cupos en dos categorías, tres jueces por atleta y $460 en premios en efectivo.

El patrocinio principal es uno solo e incluye:

- El nombre del evento: "Endurance at the Limit, presentado por {{empresa|tu marca}}"
- Tu logo principal en el backdrop, las medallas y todo el contenido en redes
- Espacio para un stand o una activación con atletas y público
- La entrega del premio de la final

La inversión es de $300, en efectivo o combinada con producto.

¿Te envío la propuesta completa? Responde este correo y coordinamos una llamada de 15 minutos.

Brando Lanchez
Endurance at the Limit · 0412-613-4013$body$
),
-- 1D · Instituciones (trato de usted; seguimiento por llamada u oficio) --
(
  'Institucional · Presentación',
  'Solicitud de apoyo: Endurance at the Limit, 3ª edición',
  'Competencia de calistenia en Maracaibo con reglamento, jueces y 40 atletas.',
  'institucion', 4, 0,
$body$Buen día {{nombre|}},

Le escribo en nombre de **Endurance at the Limit**, una competencia de resistencia en calistenia organizada en Maracaibo. La primera edición reunió a 30 atletas, y la 3ª edición abre 40 cupos en dos categorías: Élite y Alfa Junior.

Es un evento con reglamento escrito, tres jueces por atleta y código de conducta, que promueve el entrenamiento con el peso corporal entre los jóvenes de la región.

Queremos contar con el apoyo de {{empresa|su institución}} en alguno de estos puntos:

- Espacio para la competencia
- Sonido, tarima o seguridad
- Difusión en sus canales oficiales

A cambio, la institución figura como aliada en el backdrop, en la web y en las menciones oficiales del evento.

Si le interesa, le envío la propuesta formal o un oficio para canalizar la solicitud. Basta con responder este correo.

Atentamente,
Brando Lanchez
Organizador · Endurance at the Limit · 0412-613-4013$body$
),
-- 2 · Seguimiento (empresas) ---------------------------------------------
(
  'Sponsors 2/3 · Seguimiento',
  'A dónde va el aporte de un sponsor',
  'Cada aporte se asigna a algo concreto: premios, medallas o refrigerio.',
  'sponsor', 5, 4,
$body$Hola {{nombre|}},

Hace unos días te escribí sobre Endurance at the Limit. Una pregunta que nos hacen siempre es a dónde va el dinero, así que te lo dejo claro.

Cada aporte se asigna a algo concreto, y tu marca queda asociada a eso:

- **Premios en efectivo:** $100, $80 y $50 para los tres primeros de cada categoría. $460 en total.
- **Medallas y trofeos** para los atletas.
- **Refrigerio e hidratación** para atletas y jueces.

Las opciones, de nuevo:

- **$150:** los premios de la categoría Élite o Alfa Junior llevan tu nombre, y tú los entregas.
- **$50:** aliado oficial, con logo en el backdrop y en la web.
- **En especie:** producto, servicio o comida para los podios o el refrigerio.

¿Cuál te hace más sentido? Responde con la opción y te envío los detalles.

Brando Lanchez
Endurance at the Limit · 0412-613-4013$body$
),
-- 3 · Último correo (empresas) -------------------------------------------
(
  'Sponsors 3/3 · Último correo',
  'Cierro la lista de marcas de Endurance',
  'Último correo sobre el patrocinio de la 3ª edición.',
  'sponsor', 6, 5,
$body$Hola {{nombre|}},

Te escribo por última vez sobre Endurance at the Limit.

El backdrop y las medallas se mandan a imprimir con los logos confirmados hasta ese día. Después ya no podemos sumar marcas a la 3ª edición.

Si {{empresa|tu marca}} quiere estar, responde "me interesa" y te envío la propuesta. Si no es el momento, responde "ahora no" y no te vuelvo a escribir sobre esta edición.

Gracias por leer.

Brando Lanchez
Endurance at the Limit · 0412-613-4013$body$
)
) AS v(name, subject, preheader, audience_tag, sort_order, wait_days, body)
WHERE NOT EXISTS (SELECT 1 FROM public.email_campaigns c WHERE c.name = v.name);

-- Encadenar la secuencia ---------------------------------------------------
-- El 2/3 sale solo a quien recibió un primer correo de empresa hace 4+ días.
UPDATE public.email_campaigns SET after_campaigns = (
  SELECT array_agg(id) FROM public.email_campaigns
  WHERE name IN ('Sponsors 1/3 · Fitness', 'Sponsors 1/3 · Comercio local', 'Sponsors 1/3 · Marcas')
) WHERE name = 'Sponsors 2/3 · Seguimiento' AND status = 'draft';

-- El 3/3 sale solo a quien recibió el 2/3 hace 5+ días.
UPDATE public.email_campaigns SET after_campaigns = (
  SELECT array_agg(id) FROM public.email_campaigns WHERE name = 'Sponsors 2/3 · Seguimiento'
) WHERE name = 'Sponsors 3/3 · Último correo' AND status = 'draft';
