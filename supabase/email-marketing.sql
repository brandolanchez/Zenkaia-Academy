-- =====================================================================
-- Fortis · Email marketing (contactos, campañas, envíos y bandeja)
-- Ejecutar en Supabase > SQL Editor. Requiere haber corrido security-fix.sql
-- (usa la función public.is_admin()). Idempotente.
-- =====================================================================

-- 1) Contactos -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
  source TEXT,
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS email_contacts_email_key ON public.email_contacts (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS email_contacts_token_key ON public.email_contacts (unsubscribe_token);
CREATE INDEX IF NOT EXISTS email_contacts_tags_idx ON public.email_contacts USING gin (tags);

-- 2) Campañas ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  preheader TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  audience_tag TEXT,               -- NULL = todos los contactos suscritos
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent')),
  sort_order INT NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Excluir a quienes ya respondieron (etiqueta "respondio", la pone el webhook de correos recibidos)
ALTER TABLE public.email_campaigns ADD COLUMN IF NOT EXISTS exclude_replied BOOLEAN NOT NULL DEFAULT true;

-- 3) Envíos (uno por contacto y campaña: evita duplicados) --------------
CREATE TABLE IF NOT EXISTS public.email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, contact_id)
);

-- 4) Bandeja: correos recibidos, formulario web y respuestas enviadas ---
CREATE TABLE IF NOT EXISTS public.email_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction TEXT NOT NULL DEFAULT 'in' CHECK (direction IN ('in', 'out')),
  source TEXT NOT NULL DEFAULT 'email' CHECK (source IN ('email', 'form', 'reply')),
  resend_email_id TEXT UNIQUE,
  message_id TEXT,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_inbox_created_idx ON public.email_inbox (created_at DESC);

-- 5) Seguridad: solo el admin lee y escribe ------------------------------
-- Los formularios públicos, el webhook de Resend y la baja usan la service role
-- desde el servidor, que salta estas reglas.
ALTER TABLE public.email_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_inbox ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage email_contacts" ON public.email_contacts;
CREATE POLICY "Admins manage email_contacts" ON public.email_contacts
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage email_campaigns" ON public.email_campaigns;
CREATE POLICY "Admins manage email_campaigns" ON public.email_campaigns
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage email_sends" ON public.email_sends;
CREATE POLICY "Admins manage email_sends" ON public.email_sends
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage email_inbox" ON public.email_inbox;
CREATE POLICY "Admins manage email_inbox" ON public.email_inbox
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6) Campaña de patrocinio precargada (3 correos en borrador) -----------
-- Solo se insertan si todavía no existen campañas con estos nombres.
INSERT INTO public.email_campaigns (name, subject, preheader, audience_tag, sort_order, body)
SELECT * FROM (VALUES
(
  'Sponsors 1/3 · Presentación',
  '{{empresa|Tu marca}} en Endurance at the Limit',
  'La competencia de resistencia en calistenia del Zulia vuelve en su 3ª edición. Buscamos aliados.',
  'sponsor', 1,
$body$Hola {{nombre|}},

Te escribo de parte de **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. Este año llegamos a la 3ª edición y estamos sumando a las marcas que van a estar con nosotros.

El formato es simple de seguir y difícil de ganar: circuitos de cinco ejercicios contra el reloj, llaves de enfrentamiento directo hasta la final y tres jueces por atleta. Cada ronda elimina a alguien, y el público lo vive serie por serie, en el lugar y en redes.

Ahí es donde queremos ver a **{{empresa|tu marca}}**. Puedes participar de tres formas:

- Presencia de marca durante todo el evento
- Una activación con atletas y público
- Aportando premios para los ganadores

Si te interesa, responde este correo y te enviamos la propuesta con las opciones y sus condiciones.

[[Ver la competencia|https://endurance.fortisworkout.org/#sponsors]]

Un saludo,
Brando Lanchez
Endurance at the Limit$body$
),
(
  'Sponsors 2/3 · Seguimiento',
  'Lo que ve el público en una llave de eliminación directa',
  'Por qué un formato cara a cara sostiene la atención de principio a fin.',
  'sponsor', 2,
$body$Hola {{nombre|}},

Hace unos días te escribí sobre Endurance at the Limit. Te dejo tres razones concretas por las que creemos que encaja con {{empresa|tu marca}}:

**1. La atención no se dispersa.** Octavos, cuartos, semifinal, tercer lugar y final: son rondas de enfrentamiento directo y la tensión sube en cada una. Tu marca aparece cuando todos están mirando.

**2. El público es el que te interesa.** Atletas y seguidores de calistenia y entrenamiento funcional: gente joven, activa, que cuida su salud y consume deporte.

**3. Es un evento serio.** Reglamento escrito, tres jueces por atleta y un código de conducta que se cumple. Tu marca queda asociada a una competencia bien organizada.

¿Tienes 15 minutos esta semana para conversarlo? Responde este correo con el día que te funcione y te llamo.

[[Ver la competencia|https://endurance.fortisworkout.org/#sponsors]]

Un saludo,
Brando Lanchez
Endurance at the Limit$body$
),
(
  'Sponsors 3/3 · Último correo',
  '¿Sumamos a {{empresa|tu marca}} a Endurance?',
  'Último correo sobre el patrocinio de la 3ª edición.',
  'sponsor', 3,
$body$Hola {{nombre|}},

No quiero llenarte la bandeja, así que este es mi último correo sobre Endurance at the Limit.

Estamos cerrando la lista de marcas que van a acompañar la 3ª edición. Si {{empresa|tu marca}} quiere estar, todavía hay espacio para presencia en el evento, activaciones o premios.

Basta con responder este correo con un "me interesa" y te envío la propuesta. Si no es el momento, también me sirve saberlo.

Gracias por leer.

Brando Lanchez
Endurance at the Limit$body$
)
) AS v(name, subject, preheader, audience_tag, sort_order, body)
WHERE NOT EXISTS (
  SELECT 1 FROM public.email_campaigns c WHERE c.name = v.name
);
