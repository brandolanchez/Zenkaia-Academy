-- =====================================================================
-- Zenkai · Reglas de Storage
-- Ejecutar DESPUÉS de security-fix.sql (usa la función is_admin()).
-- Idempotente: se puede correr más de una vez.
--
-- El código nombra los archivos así:
--   payment-proofs → <user_id>-<timestamp>.<ext>
--   avatars        → <user_id>-<random>.<ext>
-- Por eso cada usuario queda limitado a archivos que empiezan con su propio id.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Comprobantes de pago: cada alumno ve solo los suyos; el admin ve todos.
--    Antes: cualquiera podía listar y descargar todos los comprobantes.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Permitir leer comprobantes" ON storage.objects;
DROP POLICY IF EXISTS "Comprobantes: leer propios o admin" ON storage.objects;
CREATE POLICY "Comprobantes: leer propios o admin" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-proofs'
    AND (name LIKE auth.uid()::text || '-%' OR public.is_admin())
  );

DROP POLICY IF EXISTS "Permitir subir comprobantes" ON storage.objects;
DROP POLICY IF EXISTS "Comprobantes: subir propios" ON storage.objects;
CREATE POLICY "Comprobantes: subir propios" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs'
    AND name LIKE auth.uid()::text || '-%'
  );

-- ---------------------------------------------------------------------
-- 2) Avatares: lectura pública; cada usuario solo sube o reemplaza el suyo.
--    Antes: cualquiera podía subir o sobrescribir el avatar de otro.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Permitir subir avatares" ON storage.objects;
DROP POLICY IF EXISTS "Avatares: subir propio" ON storage.objects;
CREATE POLICY "Avatares: subir propio" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND name LIKE auth.uid()::text || '-%'
  );

DROP POLICY IF EXISTS "Permitir actualizar avatares" ON storage.objects;
DROP POLICY IF EXISTS "Avatares: actualizar propio" ON storage.objects;
CREATE POLICY "Avatares: actualizar propio" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%')
  WITH CHECK (bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%');

-- "Permitir leer avatares" se mantiene: los avatares son públicos.

-- ---------------------------------------------------------------------
-- 3) Miniaturas de rutas: solo el admin sube.
--    Antes no había ninguna regla, así que subir una miniatura desde
--    el panel admin fallaba.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Miniaturas: admin sube" ON storage.objects;
CREATE POLICY "Miniaturas: admin sube" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'thumbnails' AND public.is_admin());
