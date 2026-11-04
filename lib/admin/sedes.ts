import 'server-only';
import {createClient} from '@/lib/supabase/server';
import type {AdminProfile} from '@/lib/auth/require-admin';

export type Sede = {
  id:number; nombre:string; slug:string; tipo:'hotel'|'restaurante'|'eventos';
  descripcion:string|null; direccion:string|null; telefono:string|null;
  whatsapp:string|null; email:string|null; imagen_principal:string|null;
  google_maps_url:string|null; google_rating:number|null;google_reviews_count:number|null;google_reviews_checked_at:string|null; telefonos_adicionales:string[];
  publicado:boolean; orden:number|null;
};

export async function getSedesForAdmin(admin:AdminProfile):Promise<Sede[]> {
  const started=performance.now();
  let asignacionesMs=0;
  let sedesMs=0;
  try {
  const supabase=await createClient();
  let allowedIds:number[]|null=null;
  if(admin.rol==='sede'){
    const assignmentsStarted=performance.now();
    const {data:assignments,error:assignmentError}=await supabase.from('admin_sedes')
      .select('sede_id').eq('admin_id',admin.id);
    asignacionesMs=performance.now()-assignmentsStarted;
    if(assignmentError)throw new Error('No se pudieron consultar las sedes asignadas.');
    allowedIds=(assignments??[]).map(a=>a.sede_id);
    if(allowedIds.length===0)return [];
  }
  let query=supabase.from('sedes')
    .select('id,nombre,slug,tipo,descripcion,direccion,telefono,whatsapp,email,imagen_principal,google_maps_url,google_rating,google_reviews_count,google_reviews_checked_at,telefonos_adicionales,publicado,orden')
    .order('orden',{ascending:true}).order('id',{ascending:true});
  if(allowedIds)query=query.in('id',allowedIds);
  const sedesStarted=performance.now();
  const {data,error}=await query;
  sedesMs=performance.now()-sedesStarted;
  if(error) throw new Error('No se pudieron consultar las sedes. Comprueba las políticas RLS de Supabase.');
  if(!admin.activo) return [];
  return (data??[]) as Sede[];
  }finally{
    if(process.env.ADMIN_PERF_TIMINGS==='1'){
      console.info(`[rendimiento-admin] sedes asignaciones=${Math.round(asignacionesMs)}ms consulta=${Math.round(sedesMs)}ms total=${Math.round(performance.now()-started)}ms`);
    }
  }
}

export async function getSedeForAdmin(admin:AdminProfile,id:number):Promise<Sede|null> {
  const sedes=await getSedesForAdmin(admin);
  return sedes.find(s=>s.id===id)??null;
}
