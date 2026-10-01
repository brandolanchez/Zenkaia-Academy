-- =====================================================================
-- Endurance · Imágenes en campañas y adjuntos en respuestas
-- Ejecutar en Supabase > SQL Editor (antes o después de email-sponsors-v2.sql, da igual).
-- Se puede correr más de una vez.
-- =====================================================================

-- 1) Espacios de archivos ---------------------------------------------------
-- email-assets: imágenes de los correos. Público (los clientes de correo
--   tienen que poder descargarlas). Máx. 5 MB, solo imágenes.
-- email-attachments: adjuntos de respuestas (dossier, propuestas). Privado:
--   Resend los descarga con un enlace temporal de 1 hora. Máx. 25 MB.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('email-assets', 'email-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('email-attachments', 'email-attachments', false, 26214400, NULL)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Solo el admin sube, ve y borra
DROP POLICY IF EXISTS "Correos: admin sube archivos" ON storage.objects;
CREATE POLICY "Correos: admin sube archivos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('email-assets', 'email-attachments') AND public.is_admin());

DROP POLICY IF EXISTS "Correos: admin ve archivos" ON storage.objects;
CREATE POLICY "Correos: admin ve archivos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id IN ('email-assets', 'email-attachments') AND public.is_admin());

DROP POLICY IF EXISTS "Correos: admin borra archivos" ON storage.objects;
CREATE POLICY "Correos: admin borra archivos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('email-assets', 'email-attachments') AND public.is_admin());

-- Las líneas [FOTO: …] de los correos 2/4 y 4/4 ya vienen en email-sponsors-v2.sql.
