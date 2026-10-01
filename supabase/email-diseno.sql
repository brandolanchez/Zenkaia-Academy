-- =====================================================================
-- Endurance · Diseño nuevo de los correos de patrocinio
-- Ejecutar en Supabase > SQL Editor después de email-sponsors-v2.sql.
-- - Textos con negritas, cifras resaltadas y franja de datos.
-- - Quita la firma escrita a mano: ahora la firma (con logo, WhatsApp e
--   Instagram) la agrega el sistema en todos los correos.
-- - Si ya subiste una foto en el 2/4 o el 4/4, se conserva.
-- Solo cambia correos en borrador. Se puede correr más de una vez.
-- =====================================================================

-- Sponsors 1/4 · Fitness
UPDATE public.email_campaigns SET body = $b320880$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. En la primera edición compitieron 30 atletas. Así viene la 3ª:

[[DATOS: 40 | atletas ; $460 | en premios ; 3 | jueces por atleta]]

Te escribo porque **el público del evento es tu cliente**: gente que entrena todas las semanas, compra suplementos y ropa deportiva y paga un gimnasio.

Trabajamos con pocas marcas por edición, para que cada una se vea:

- **Patrocinio de categoría · ==$150==:** La categoría Élite o Alfa Junior lleva tu nombre y tú entregas los premios.
- **Aliado oficial · ==$50==** o su equivalente en producto. Logo en el backdrop y en la web, y menciones durante el evento.
- **Aliado de premios:** Productos, membresías o ropa para los ganadores.

Nos han acompañado **Valhalla Fitness Center** como sede y **Nature** con su té. El formato y las categorías están en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

**¿Te envío la propuesta completa?** Responde este correo o escríbeme por [WhatsApp](https://wa.me/584126134013).$b320880$, updated_at = now()
WHERE name = 'Sponsors 1/4 · Fitness' AND status = 'draft';

-- Sponsors 1/4 · Comercio local
UPDATE public.email_campaigns SET body = $b869709$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, una competencia de resistencia en calistenia que se hace aquí en Maracaibo. Vamos por la 3ª edición:

[[DATOS: 40 | atletas ; $460 | en premios ; 3 | jueces por atleta]]

Cada atleta entra con tres acompañantes, así que **el público del día es gente joven de la ciudad**, activa y que sigue el deporte en redes.

No hace falta un presupuesto grande para estar:

- **Aliado oficial · ==$50==:** Tu logo en el backdrop y en la web, y menciones del animador durante el evento.
- **Aliado en especie:** Comida, bebidas o servicios para atletas y jueces, con la misma visibilidad. Así nos acompañó **Nature** en la primera edición, con su té.
- **Patrocinio de categoría · ==$150==:** Tu nombre en los premios de Élite o Alfa Junior.

Puedes ver cómo es la competencia en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

**¿Te paso la propuesta?** Responde este correo o escríbeme por [WhatsApp](https://wa.me/584126134013).$b869709$, updated_at = now()
WHERE name = 'Sponsors 1/4 · Comercio local' AND status = 'draft';

-- Sponsors 1/4 · Marcas
UPDATE public.email_campaigns SET body = $b358815$Hola {{nombre|}},

Soy Brando Lanchez y organizo **Endurance at the Limit**, la competencia de resistencia en calistenia del Zulia. Vamos por la 3ª edición y **buscamos un solo patrocinador principal**.

[[DATOS: 40 | atletas ; $460 | en premios ; 3 | jueces por atleta]]

El formato: circuitos de cinco ejercicios contra el reloj, una clasificación que ordena a los atletas y llaves cara a cara hasta la final.

El patrocinio principal incluye:

- **El nombre del evento:** "Endurance at the Limit, presentado por {{empresa|tu marca}}"
- **Tu logo principal** en el backdrop, las medallas y todo el contenido en redes
- **Un stand o una activación** con atletas y público
- **La entrega del premio** de la final

La inversión es de ==$300==, en efectivo o combinada con producto. Puedes ver el formato completo en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

**¿Te envío la propuesta?** Responde este correo y coordinamos una llamada de 15 minutos.$b358815$, updated_at = now()
WHERE name = 'Sponsors 1/4 · Marcas' AND status = 'draft';

-- Institucional · Presentación
UPDATE public.email_campaigns SET body = $b211600$Buen día {{nombre|}},

Le escribo en nombre de **Endurance at the Limit**, una competencia de resistencia en calistenia organizada en Maracaibo. En la primera edición compitieron 30 atletas, y la 3ª edición abre cupos en dos categorías: Élite y Alfa Junior.

[[DATOS: 40 | atletas ; $460 | en premios ; 3 | jueces por atleta]]

Es un evento con **reglamento escrito, jueces y código de conducta**, que promueve el entrenamiento con el peso corporal entre los jóvenes de la región.

Queremos contar con el apoyo de {{empresa|su institución}} en alguno de estos puntos:

- **Espacio** para la competencia
- **Sonido, tarima o seguridad**
- **Difusión** en sus canales oficiales

A cambio, la institución figura como aliada en el backdrop, en la web y en las menciones oficiales del evento. La información está en [endurance.fortisworkout.org](https://endurance.fortisworkout.org).

Si le interesa, le envío la propuesta formal o un oficio para canalizar la solicitud. **Basta con responder este correo.**

Atentamente,$b211600$, updated_at = now()
WHERE name = 'Institucional · Presentación' AND status = 'draft';

-- Sponsors 2/4 · Seguimiento
UPDATE public.email_campaigns SET body = CASE WHEN body ~ '!\[[^]]*\]\([^)]*\)' THEN replace($b453736$Hola {{nombre|}},

Hace unos días te escribí sobre Endurance at the Limit. Lo que más nos preguntan las marcas es **a dónde va el dinero**, así que te lo dejo claro.

[FOTO: Podio de la edición anterior, con los ganadores y sus premios o medallas. Demuestra que los premios se entregan de verdad.]

Los premios en efectivo de cada categoría:

[[DATOS: $100 | 1.er lugar ; $80 | 2.º lugar ; $50 | 3.er lugar]]

Cada aporte se asigna a algo concreto, y tu marca queda asociada a eso:

- **Premios en efectivo:** $460 entre las dos categorías
- **Medallas y trofeos** para los atletas
- **Refrigerio e hidratación** para atletas y jueces

Las opciones:

- **==$150==:** Los premios de la categoría Élite o Alfa Junior llevan tu nombre, y tú los entregas.
- **==$50==:** Aliado oficial, con logo en el backdrop y en la web.
- **En especie:** Producto, servicio o comida para los podios o el refrigerio.

**¿Cuál te hace más sentido?** Responde con la opción y te envío los detalles.$b453736$, '[FOTO: Podio de la edición anterior, con los ganadores y sus premios o medallas. Demuestra que los premios se entregan de verdad.]', substring(body from '!\[[^]]*\]\([^)]*\)')) ELSE $b453736$Hola {{nombre|}},

Hace unos días te escribí sobre Endurance at the Limit. Lo que más nos preguntan las marcas es **a dónde va el dinero**, así que te lo dejo claro.

[FOTO: Podio de la edición anterior, con los ganadores y sus premios o medallas. Demuestra que los premios se entregan de verdad.]

Los premios en efectivo de cada categoría:

[[DATOS: $100 | 1.er lugar ; $80 | 2.º lugar ; $50 | 3.er lugar]]

Cada aporte se asigna a algo concreto, y tu marca queda asociada a eso:

- **Premios en efectivo:** $460 entre las dos categorías
- **Medallas y trofeos** para los atletas
- **Refrigerio e hidratación** para atletas y jueces

Las opciones:

- **==$150==:** Los premios de la categoría Élite o Alfa Junior llevan tu nombre, y tú los entregas.
- **==$50==:** Aliado oficial, con logo en el backdrop y en la web.
- **En especie:** Producto, servicio o comida para los podios o el refrigerio.

**¿Cuál te hace más sentido?** Responde con la opción y te envío los detalles.$b453736$ END, updated_at = now()
WHERE name = 'Sponsors 2/4 · Seguimiento' AND status = 'draft';

-- Sponsors 3/4 · En especie
UPDATE public.email_campaigns SET body = $b94140$Hola {{nombre|}},

Sé que no siempre hay presupuesto en efectivo para patrocinar un evento. Por eso **también se puede participar con lo que {{empresa|tu negocio}} ya vende**:

- **Bebidas o agua:** La hidratación de 40 atletas y sus jueces. Así participó Nature en la primera edición.
- **Comida:** El refrigerio de los atletas.
- **Productos o ropa:** Premios para el podio de cada categoría.
- **Servicios:** Membresías, sesiones de fisioterapia, evaluaciones o descuentos para los ganadores.

Un aporte en especie de ==$50 o más==, a precio de venta, tiene **la misma visibilidad que un aliado oficial**: logo en el backdrop y en la web, y menciones durante el evento.

**¿Qué podría aportar {{empresa|tu negocio}}?** Responde con una idea y la armamos juntos.$b94140$, updated_at = now()
WHERE name = 'Sponsors 3/4 · En especie' AND status = 'draft';

-- Sponsors 4/4 · Último correo
UPDATE public.email_campaigns SET body = CASE WHEN body ~ '!\[[^]]*\]\([^)]*\)' THEN replace($b29003$Hola {{nombre|}},

Te escribo por última vez sobre Endurance at the Limit.

[FOTO: El evento anterior con una marca a la vista (backdrop, banner, mesa de Nature o la sede de Valhalla). Si no tienes, una foto de la competencia con público. Así ve el sponsor cómo luciría su marca.]

El backdrop y las medallas se mandan a imprimir con los logos confirmados hasta ese día. **Después ya no podemos sumar marcas a la 3ª edición.**

Si {{empresa|tu marca}} quiere estar, responde **"me interesa"** y te envío la propuesta. Si no es el momento, responde **"ahora no"** y no te vuelvo a escribir sobre esta edición.

Gracias por leer.$b29003$, '[FOTO: El evento anterior con una marca a la vista (backdrop, banner, mesa de Nature o la sede de Valhalla). Si no tienes, una foto de la competencia con público. Así ve el sponsor cómo luciría su marca.]', substring(body from '!\[[^]]*\]\([^)]*\)')) ELSE $b29003$Hola {{nombre|}},

Te escribo por última vez sobre Endurance at the Limit.

[FOTO: El evento anterior con una marca a la vista (backdrop, banner, mesa de Nature o la sede de Valhalla). Si no tienes, una foto de la competencia con público. Así ve el sponsor cómo luciría su marca.]

El backdrop y las medallas se mandan a imprimir con los logos confirmados hasta ese día. **Después ya no podemos sumar marcas a la 3ª edición.**

Si {{empresa|tu marca}} quiere estar, responde **"me interesa"** y te envío la propuesta. Si no es el momento, responde **"ahora no"** y no te vuelvo a escribir sobre esta edición.

Gracias por leer.$b29003$ END, updated_at = now()
WHERE name = 'Sponsors 4/4 · Último correo' AND status = 'draft';
