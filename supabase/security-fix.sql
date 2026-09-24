-- =====================================================================
-- Zenkai · Parche de seguridad (RLS)
-- Ejecutar en Supabase > SQL Editor, ANTES de subir el código nuevo.
-- Es idempotente: se puede correr más de una vez.
-- =====================================================================

-- 0) (Opcional, recomendado) Ver qué políticas existen hoy en la base real.
--    Si aparece alguna política permisiva extra en profiles o videos,
--    habría que revisarla, porque las políticas permisivas se suman (OR).
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;


-- ---------------------------------------------------------------------
-- 1) Función is_admin() — SECURITY DEFINER para no chocar con el RLS
--    de profiles (evita recursión en las políticas).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


-- ---------------------------------------------------------------------
-- 2) BUG #3 — Un alumno no puede darse rol admin ni marcarse como pagado.
-- ---------------------------------------------------------------------

-- 2a. Al registrarse, el perfil solo puede nacer como student sin pago.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND COALESCE(role, 'student') = 'student'
    AND COALESCE(has_paid, false) = false
  );

-- 2b. Al editar su perfil, role y has_paid quedan congelados salvo que
--     quien edita sea admin (o el service role desde el servidor).
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role     := OLD.role;
  NEW.has_paid := OLD.has_paid;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER protect_profile_privileged_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- 2c. Permisos de admin sobre profiles (listar alumnos, marcar has_paid).
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());


-- ---------------------------------------------------------------------
-- 3) BUG #5 — Las URLs de videos pagos dejan de ser públicas.
-- ---------------------------------------------------------------------

-- 3a. La tabla videos solo entrega filas (con video_url) si el video es
--     gratis, si el alumno tiene la ruta, o si es admin.
DROP POLICY IF EXISTS "Anyone can view video metadata" ON public.videos;
DROP POLICY IF EXISTS "Students can view accessible videos" ON public.videos;
CREATE POLICY "Students can view accessible videos" ON public.videos
  FOR SELECT USING (
    is_free
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.user_courses uc
      WHERE uc.user_id = auth.uid() AND uc.course_id = videos.course_id
    )
  );

-- 3b. Vista pública SIN video_url, para mostrar el temario completo
--     (con candados) a quien todavía no pagó. La vista corre con los
--     permisos de su dueño, por eso puede listar todas las clases.
CREATE OR REPLACE VIEW public.videos_public AS
  SELECT id, course_id, title, description, is_free, "order", created_at
  FROM public.videos;

REVOKE ALL ON public.videos_public FROM anon, authenticated;
GRANT SELECT ON public.videos_public TO anon, authenticated;


-- ---------------------------------------------------------------------
-- 4) Permisos de admin que el código ya usa (pagos, accesos, rutas, videos).
--    Si ya los creaste con otro nombre, estos no hacen daño.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage user_courses" ON public.user_courses;
CREATE POLICY "Admins manage user_courses" ON public.user_courses
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage videos" ON public.videos;
CREATE POLICY "Admins manage videos" ON public.videos
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
