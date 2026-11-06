-- Ejecutar una sola vez en el SQL Editor de Supabase.
-- Amplía la configuración de portada existente; conserva el video y las políticas RLS.
ALTER TABLE public.portada_principal
  ADD COLUMN IF NOT EXISTS modo TEXT NOT NULL DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS imagen_url TEXT,
  ADD COLUMN IF NOT EXISTS imagen_clave_r2 TEXT,
  ADD COLUMN IF NOT EXISTS carrusel JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.portada_principal
SET modo='video' WHERE modo IS NULL OR modo NOT IN ('video','imagen','carrusel');

-- Los elementos de carrusel se guardan como:
-- [{"url":"https://...","clave_r2":"portada-principal/...webp"}]
-- No se necesita un bucket nuevo ni políticas RLS adicionales.
