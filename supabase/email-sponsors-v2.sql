-- =====================================================================
-- Endurance · Secuencia de patrocinio (versión final)
-- Ejecutar en Supabase > SQL Editor DESPUÉS de email-marketing.sql.
--
-- Secuencia para empresas (≈ 2 semanas por contacto):
--   Día 0  → correo 1, según el tipo de empresa (fitness / comercio / marca)
--   Día 4  → 2/4 Seguimiento: a dónde va el aporte  (con foto del podio)
--   Día 9  → 3/4 En especie: si no hay efectivo
--   Día 15 → 4/4 Último correo                       (con foto del evento)
-- Instituciones: un solo correo; el seguimiento es por llamada u oficio.
--
-- Borra y vuelve a crear los borradores que NUNCA se enviaron (versiones
-- anteriores incluidas). Las campañas ya enviadas no se tocan.
-- Se puede correr más de una vez.
-- =====================================================================

ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS after_campaigns UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS wait_days INT NOT NULL DEFAULT 0;
ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS template TEXT NOT NULL DEFAULT 'personal';
DO $$ BEGIN
  ALTER TABLE public.email_campaigns ADD CONSTRAINT email_campaigns_template_check CHECK (template IN ('personal', 'marca'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS email_sends_campaign_idx ON public.email_sends (campaign_id, status, created_at);

DELETE FROM public.email_campaigns c
WHERE c.status = 'draft'
  AND c.name IN (
    'Sponsors 1/3 · Presentación', 'Sponsors 2/3 · Seguimiento', 'Sponsors 3/3 · Último correo',
    'Sponsors 1/3 · Fitness', 'Sponsors 1/3 · Comercio local', 'Sponsors 1/3 · Marcas',
    'Sponsors 1/4 · Fitness', 'Sponsors 1/4 · Comercio local', 'Sponsors 1/4 · Marcas',
    'Institucional · Presentación',
    'Sponsors 2/4 · Seguimiento', 'Sponsors 3/4 · En especie', 'Sponsors 4/4 · Último correo'
  )
  AND NOT EXISTS (SELECT 1 FROM public.email_sends s WHERE s.campaign_id = c.id);

INSERT INTO public.email_campaigns (name, subject, preheader, audience_tag, sort_order, wait_days, template, body)
SELECT * FROM (VALUES
-- 1A · Gimnasios, suplementos, ropa deportiva, nutrición -----------------
(
  'Sponsors 1/4 · Fitness',
  '{{empresa|Tu marca}} en la competencia de calistenia del Zulia',
  '40 atletas, $460 en premios y pocas marcas por edición.',
  'fitness', 1, 0, 'personal',
$body$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. En la primera edición compitieron 30 atletas; para la 3ª abrimos 40 cupos en dos categorías y repartimos $460 en premios en efectivo.

Te escribo porque el público del evento es tu cliente: gente que entrena todas las semanas, compra suplementos y ropa deportiva y paga un gimnasio.

Trabajamos con pocas marcas por edición, para que cada una se vea:

- **Patrocinio de categoría ($150):** la categoría Élite o Alfa Junior lleva tu nombre y tú entregas los premios.
- **Aliado oficial ($50 o su equivalente en producto):** logo en el backdrop y en la web, y menciones durante el evento.
- **Aliado de premios:** productos, membresías o ropa para los ganadores.

Nos han acompañado Valhalla Fitness Center como sede y Nature con su té. El formato y las categorías están en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

¿Te envío la propuesta completa? Responde este correo o escríbeme por WhatsApp.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
),
-- 1B · Comercio local: comida, bebidas, salud, servicios ------------------
(
  'Sponsors 1/4 · Comercio local',
  'Patrocinio local para {{empresa|tu negocio}}',
  'Una competencia de calistenia en Maracaibo. Se puede participar desde $50 o en especie.',
  'comercio', 2, 0, 'personal',
$body$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, una competencia de resistencia en calistenia que se hace aquí en Maracaibo. Vamos por la 3ª edición: 40 atletas, tres jueces por atleta y $460 en premios en efectivo.

Cada atleta entra con tres acompañantes, así que el público del día es gente joven de la ciudad, activa y que sigue el deporte en redes.

No hace falta un presupuesto grande para estar:

- **Aliado oficial ($50):** tu logo en el backdrop y en la web, y menciones del animador durante el evento.
- **Aliado en especie:** comida, bebidas o servicios para atletas y jueces, con la misma visibilidad. Así nos acompañó Nature en la primera edición, con su té.
- **Patrocinio de categoría ($150):** tu nombre en los premios de Élite o Alfa Junior.

Puedes ver cómo es la competencia en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

¿Te paso la propuesta? Responde este correo o escríbeme por WhatsApp.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
),
-- 1C · Marcas grandes / nacionales ----------------------------------------
(
  'Sponsors 1/4 · Marcas',
  'Endurance at the Limit, presentado por {{empresa|tu marca}}',
  'Buscamos un solo patrocinador principal para la 3ª edición.',
  'marca', 3, 0, 'personal',
$body$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. Vamos por la 3ª edición y buscamos un patrocinador principal.

El formato: circuitos de cinco ejercicios contra el reloj, una clasificación que ordena a los atletas y llaves cara a cara hasta la final. Son 40 cupos en dos categorías, tres jueces por atleta y $460 en premios en efectivo.

El patrocinio principal es uno solo e incluye:

- El nombre del evento: "Endurance at the Limit, presentado por {{empresa|tu marca}}"
- Tu logo principal en el backdrop, las medallas y todo el contenido en redes
- Espacio para un stand o una activación con atletas y público
- La entrega del premio de la final

La inversión es de $300, en efectivo o combinada con producto. Puedes ver el formato completo en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

¿Te envío la propuesta? Responde este correo y coordinamos una llamada de 15 minutos.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
),
-- 1D · Instituciones (trato de usted; seguimiento por llamada u oficio) --
(
  'Institucional · Presentación',
  'Solicitud de apoyo: Endurance at the Limit, 3ª edición',
  'Competencia de calistenia en Maracaibo con reglamento, jueces y 40 atletas.',
  'institucion', 4, 0, 'marca',
$body$Buen día {{nombre|}},

Le escribo en nombre de **Endurance at the Limit**, una competencia de resistencia en calistenia organizada en Maracaibo. En la primera edición compitieron 30 atletas, y la 3ª edición abre 40 cupos en dos categorías: Élite y Alfa Junior.

Es un evento con reglamento escrito, tres jueces por atleta y código de conducta, que promueve el entrenamiento con el peso corporal entre los jóvenes de la región.

Queremos contar con el apoyo de {{empresa|su institución}} en alguno de estos puntos:

- Espacio para la competencia
- Sonido, tarima o seguridad
- Difusión en sus canales oficiales

A cambio, la institución figura como aliada en el backdrop, en la web y en las menciones oficiales del evento. La información del evento está en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

Si le interesa, le envío la propuesta formal o un oficio para canalizar la solicitud. Basta con responder este correo.

Atentamente,
Brando Lanchez
Organizador · Endurance at the Limit
0412-613-4013 · Instagram: @fortisworkout$body$
),
-- 2/4 · Día 4: a dónde va el aporte ---------------------------------------
(
  'Sponsors 2/4 · Seguimiento',
  'A dónde va el aporte de un sponsor',
  'Cada aporte se asigna a algo concreto: premios, medallas o refrigerio.',
  'sponsor', 5, 4, 'personal',
$body$Hola {{nombre|}},

Hace unos días te escribí sobre Endurance at the Limit. Lo que más nos preguntan las marcas es a dónde va el dinero, así que te lo dejo claro.

[FOTO: Podio de la edición anterior, con los ganadores y sus premios o medallas. Demuestra que los premios se entregan de verdad.]

Cada aporte se asigna a algo concreto, y tu marca queda asociada a eso:

- **Premios en efectivo:** $100, $80 y $50 para los tres primeros de cada categoría. $460 en total.
- **Medallas y trofeos** para los atletas.
- **Refrigerio e hidratación** para atletas y jueces.

Las opciones:

- **$150:** los premios de la categoría Élite o Alfa Junior llevan tu nombre, y tú los entregas.
- **$50:** aliado oficial, con logo en el backdrop y en la web.
- **En especie:** producto, servicio o comida para los podios o el refrigerio.

¿Cuál te hace más sentido? Responde con la opción y te envío los detalles.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
),
-- 3/4 · Día 9: en especie --------------------------------------------------
(
  'Sponsors 3/4 · En especie',
  'Si el efectivo no es opción',
  'También se puede patrocinar con lo que tu negocio ya vende.',
  'sponsor', 6, 5, 'personal',
$body$Hola {{nombre|}},

Sé que no siempre hay presupuesto en efectivo para patrocinar un evento. Por eso también se puede participar con lo que {{empresa|tu negocio}} ya vende:

- **Bebidas o agua:** la hidratación de 40 atletas y sus jueces. Así participó Nature en la primera edición.
- **Comida:** el refrigerio de los atletas.
- **Productos o ropa:** premios para el podio de cada categoría.
- **Servicios:** membresías, sesiones de fisioterapia, evaluaciones o descuentos para los ganadores.

Un aporte en especie de $50 o más, a precio de venta, tiene la misma visibilidad que un aliado oficial: logo en el backdrop y en la web, y menciones durante el evento.

¿Qué podría aportar {{empresa|tu negocio}}? Responde con una idea y la armamos juntos.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
),
-- 4/4 · Día 15: último correo ----------------------------------------------
(
  'Sponsors 4/4 · Último correo',
  'Cierro la lista de marcas de Endurance',
  'Último correo sobre el patrocinio de la 3ª edición.',
  'sponsor', 7, 6, 'personal',
$body$Hola {{nombre|}},

Te escribo por última vez sobre Endurance at the Limit.

[FOTO: El evento anterior con una marca a la vista (backdrop, banner, mesa de Nature o la sede de Valhalla). Si no tienes, una foto de la competencia con público. Así ve el sponsor cómo luciría su marca.]

El backdrop y las medallas se mandan a imprimir con los logos confirmados hasta ese día. Después ya no podemos sumar marcas a la 3ª edición.

Si {{empresa|tu marca}} quiere estar, responde "me interesa" y te envío la propuesta. Si no es el momento, responde "ahora no" y no te vuelvo a escribir sobre esta edición.

Gracias por leer.

Brando Lanchez
Organizador · Endurance at the Limit
WhatsApp: [0412-613-4013](https://wa.me/584126134013) · Instagram: [@fortisworkout](https://www.instagram.com/fortisworkout/)$body$
)
) AS v(name, subject, preheader, audience_tag, sort_order, wait_days, template, body)
WHERE NOT EXISTS (SELECT 1 FROM public.email_campaigns c WHERE c.name = v.name);

-- Encadenar la secuencia ---------------------------------------------------
UPDATE public.email_campaigns SET after_campaigns = (
  SELECT array_agg(id) FROM public.email_campaigns
  WHERE name IN ('Sponsors 1/4 · Fitness', 'Sponsors 1/4 · Comercio local', 'Sponsors 1/4 · Marcas')
) WHERE name = 'Sponsors 2/4 · Seguimiento' AND status = 'draft';

UPDATE public.email_campaigns SET after_campaigns = (
  SELECT array_agg(id) FROM public.email_campaigns WHERE name = 'Sponsors 2/4 · Seguimiento'
) WHERE name = 'Sponsors 3/4 · En especie' AND status = 'draft';

UPDATE public.email_campaigns SET after_campaigns = (
  SELECT array_agg(id) FROM public.email_campaigns WHERE name = 'Sponsors 3/4 · En especie'
) WHERE name = 'Sponsors 4/4 · Último correo' AND status = 'draft';
