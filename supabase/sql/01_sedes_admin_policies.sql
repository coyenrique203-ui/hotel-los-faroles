-- Ejecutar una sola vez desde Supabase > SQL Editor.
-- No elimina datos ni cambia las columnas existentes.
-- Política adicional de lectura: el administrador general puede ver todas las sedes;
-- el administrador de sede solamente aquellas asignadas en admin_sedes.

alter table public.sedes enable row level security;

drop policy if exists "admin_sedes_select" on public.sedes;
create policy "admin_sedes_select" on public.sedes
for select to authenticated
using (
  exists (
    select 1 from public.perfiles_admin p
    where p.id = (select auth.uid()) and p.activo = true
      and (p.rol = 'general' or (
        p.rol = 'sede' and exists (
          select 1 from public.admin_sedes a
          where a.admin_id = p.id and a.sede_id = sedes.id
        )
      ))
  )
);

drop policy if exists "admin_sedes_update" on public.sedes;
create policy "admin_sedes_update" on public.sedes
for update to authenticated
using (
  exists (
    select 1 from public.perfiles_admin p
    where p.id = (select auth.uid()) and p.activo = true
      and (p.rol = 'general' or (
        p.rol = 'sede' and exists (
          select 1 from public.admin_sedes a
          where a.admin_id = p.id and a.sede_id = sedes.id
        )
      ))
  )
)
with check (
  exists (
    select 1 from public.perfiles_admin p
    where p.id = (select auth.uid()) and p.activo = true
      and (p.rol = 'general' or (
        p.rol = 'sede' and exists (
          select 1 from public.admin_sedes a
          where a.admin_id = p.id and a.sede_id = sedes.id
        )
      ))
  )
);

-- Si hay políticas anteriores de escritura sobre sedes, revisarlas en
-- Authentication > Policies: varias políticas permissive se combinan con OR.
-- No crear políticas INSERT/DELETE todavía; esta etapa solo edita registros existentes.
