import 'server-only';
import {createClient} from '@/lib/supabase/server';
import type {PublicRoom} from '@/lib/public-content';

// Compatibilidad con sedes creadas dinámicamente y sus cargadores de habitaciones.
export async function withRoomAmenities(rooms:PublicRoom[]|undefined):Promise<PublicRoom[]|undefined>{
 if(!rooms?.length||rooms.every(room=>room.comodidades!==undefined))return rooms;
 try{
  const db=await createClient();
  const {data,error}=await db.from('tipos_habitacion').select('id,comodidades,descripcion_detallada')
   .in('id',rooms.map(room=>room.id)).eq('publicado',true);
  if(error)return rooms;
  const lookup=new Map((data??[]).map(row=>[row.id,row]));
  return rooms.map(room=>({
   ...room,
   comodidades:room.comodidades??lookup.get(room.id)?.comodidades??[],
   descripcionDetallada:room.descripcionDetallada??lookup.get(room.id)?.descripcion_detallada??'',
  }));
 }catch{return rooms;}
}
