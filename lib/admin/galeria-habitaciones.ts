import 'server-only';
import {createClient} from '@/lib/supabase/server';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import type {AdminProfile} from '@/lib/auth/require-admin';
import type {RoomType} from '@/lib/admin/habitaciones';

export type RoomImage={id:number;tipo_habitacion_id:number;titulo:string|null;texto_alternativo:string|null;nombre_archivo:string;clave_r2:string;url_publica:string;destacada:boolean;publicada:boolean;orden:number};

export async function getRoomGallery(admin:AdminProfile,typeId:number){
 const db=await createClient();
 const [tipoResultado,sedes]=await Promise.all([
  db.from('tipos_habitacion').select('id,sede_id,nombre,slug,imagen_principal').eq('id',typeId).maybeSingle(),
  getSedesForAdmin(admin),
 ]);
 const {data:tipo,error}=tipoResultado;
 if(error||!tipo)return null;
 const sede=sedes.find(s=>s.tipo==='hotel'&&s.id===tipo.sede_id);
 if(!sede)return null;
 const {data:imagenes,error:imagesError}=await db.from('imagenes')
  .select('id,tipo_habitacion_id,titulo,texto_alternativo,nombre_archivo,clave_r2,url_publica,destacada,publicada,orden')
  .eq('tipo_habitacion_id',typeId).is('sede_id',null)
  .order('orden',{ascending:true}).order('id',{ascending:true});
 if(imagesError)throw new Error('No se pudo consultar la galería de la habitación. Ejecuta su SQL de permisos.');
 return {tipo:tipo as Pick<RoomType,'id'|'sede_id'|'nombre'|'slug'|'imagen_principal'>,sede,imagenes:(imagenes??[]) as RoomImage[]};
}
