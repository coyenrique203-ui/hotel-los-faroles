-- Consulta de diagnóstico para Supabase SQL Editor.
-- No crea, modifica ni elimina tablas ni usuarios.
select p.id,p.nombre,u.email,p.rol,p.activo,
       coalesce(string_agg(s.nombre, ', ' order by s.nombre), 'Sin sedes asignadas') as sedes
from public.perfiles_admin p
join auth.users u on u.id=p.id
left join public.admin_sedes a on a.admin_id=p.id
left join public.sedes s on s.id=a.sede_id
group by p.id,p.nombre,u.email,p.rol,p.activo
order by p.nombre;
