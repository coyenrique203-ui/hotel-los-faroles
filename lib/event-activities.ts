import 'server-only';
import {createClient} from '@/lib/supabase/server';

export type Activity={id:number;sede_id:number;titulo:string;descripcion:string|null;fecha_evento:string|null;publicado:boolean;fotos:{id:number;url_publica:string;clave_r2:string;orden:number}[]};

export async function getEventActivities(sedeId:number,onlyPublished=false):Promise<Activity[]>{
 try{
  const db=await createClient();
  let query=db.from('actividades_eventos').select('id,sede_id,titulo,descripcion,fecha_evento,publicado').eq('sede_id',sedeId);
  if(onlyPublished)query=query.eq('publicado',true);
  const {data,error}=await query.order('fecha_evento',{ascending:false,nullsFirst:false}).order('id',{ascending:false}).limit(50);
  if(error)return [];
  const rows=data??[];
  if(!rows.length)return [];
  const {data:photos,error:photoError}=await db.from('actividades_eventos_fotos').select('id,actividad_id,url_publica,clave_r2,orden').in('actividad_id',rows.map(e=>e.id)).order('orden').order('id');
  if(photoError)return rows.map(e=>({...e,fotos:[]}));
  return rows.map(e=>({...e,fotos:(photos??[]).filter(p=>p.actividad_id===e.id).map(p=>({id:p.id,url_publica:p.url_publica,clave_r2:p.clave_r2,orden:p.orden}))})) as Activity[];
 }catch{return [];}
}
