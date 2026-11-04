-- Galería de actividades realizadas · Los Faroles
-- Ejecutar en Supabase SQL Editor; no altera habitaciones ni reseñas.
create table if not exists public.actividades_eventos (
 id bigint generated always as identity primary key,
 sede_id bigint not null references public.sedes(id) on delete cascade,
 titulo varchar(160) not null,
 descripcion text,
 fecha_evento date,
 publicado boolean not null default false,
 creado_en timestamptz not null default now(),
 constraint actividades_eventos_titulo_chk check (length(trim(titulo))>=3)
);
create table if not exists public.actividades_eventos_fotos (
 id bigint generated always as identity primary key,
 actividad_id bigint not null references public.actividades_eventos(id) on delete cascade,
 url_publica text not null,
 clave_r2 text not null,
 orden integer not null default 0
);
create index if not exists actividades_eventos_sede_idx on public.actividades_eventos(sede_id,fecha_evento desc,id desc);
create index if not exists actividades_eventos_fotos_actividad_idx on public.actividades_eventos_fotos(actividad_id,orden,id);
alter table public.actividades_eventos enable row level security;
alter table public.actividades_eventos_fotos enable row level security;
-- Autorización reutilizable para el establecimiento, sin modificar funciones existentes.
create or replace function public.puede_editar_actividad_sede(p_id bigint)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (
  select 1 from public.sedes s
  join public.perfiles_admin p on p.id = (select auth.uid())
  where s.id=p_id and s.tipo='eventos' and p.activo
  and (p.rol='general' or (p.rol='sede' and exists (
   select 1 from public.admin_sedes a where a.admin_id=p.id and a.sede_id=s.id
  )))
 );
$$;
revoke all on function public.puede_editar_actividad_sede(bigint) from public;
grant execute on function public.puede_editar_actividad_sede(bigint) to authenticated;

drop policy if exists "actividades_publicas" on public.actividades_eventos;
create policy "actividades_publicas" on public.actividades_eventos for select to anon,authenticated
using (publicado and exists(select 1 from public.sedes s where s.id=sede_id and s.publicado and s.tipo='eventos'));
drop policy if exists "actividades_admin_select" on public.actividades_eventos;
create policy "actividades_admin_select" on public.actividades_eventos for select to authenticated
using (public.puede_editar_actividad_sede(sede_id));
drop policy if exists "actividades_admin_insert" on public.actividades_eventos;
create policy "actividades_admin_insert" on public.actividades_eventos for insert to authenticated
with check (public.puede_editar_actividad_sede(sede_id));
drop policy if exists "actividades_admin_update" on public.actividades_eventos;
create policy "actividades_admin_update" on public.actividades_eventos for update to authenticated
using (public.puede_editar_actividad_sede(sede_id)) with check (public.puede_editar_actividad_sede(sede_id));
drop policy if exists "actividades_admin_delete" on public.actividades_eventos;
create policy "actividades_admin_delete" on public.actividades_eventos for delete to authenticated
using (public.puede_editar_actividad_sede(sede_id));

drop policy if exists "actividades_fotos_publicas" on public.actividades_eventos_fotos;
create policy "actividades_fotos_publicas" on public.actividades_eventos_fotos for select to anon,authenticated
using (exists(select 1 from public.actividades_eventos e where e.id=actividad_id and e.publicado and exists(select 1 from public.sedes s where s.id=e.sede_id and s.publicado)));
drop policy if exists "actividades_fotos_admin_select" on public.actividades_eventos_fotos;
create policy "actividades_fotos_admin_select" on public.actividades_eventos_fotos for select to authenticated
using (exists(select 1 from public.actividades_eventos e where e.id=actividad_id and public.puede_editar_actividad_sede(e.sede_id)));
drop policy if exists "actividades_fotos_admin_insert" on public.actividades_eventos_fotos;
create policy "actividades_fotos_admin_insert" on public.actividades_eventos_fotos for insert to authenticated
with check (exists(select 1 from public.actividades_eventos e where e.id=actividad_id and public.puede_editar_actividad_sede(e.sede_id)));
drop policy if exists "actividades_fotos_admin_delete" on public.actividades_eventos_fotos;
create policy "actividades_fotos_admin_delete" on public.actividades_eventos_fotos for delete to authenticated
using (exists(select 1 from public.actividades_eventos e where e.id=actividad_id and public.puede_editar_actividad_sede(e.sede_id)));
