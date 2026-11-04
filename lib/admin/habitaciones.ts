import 'server-only';
import {createClient} from '@/lib/supabase/server';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import type {AdminProfile} from '@/lib/auth/require-admin';

export type RoomType={id:number;sede_id:number;nombre:string;slug:string;descripcion_corta:string|null;descripcion_detallada:string|null;capacidad_personas:number;cantidad_camas:number;tipo_cama:string|null;precio_desde:number|null;imagen_principal:string|null;publicado:boolean;orden:number|null;comodidades:string[]};

export async function getRoomAdminData(admin:AdminProfile,sedeId?:number){
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='hotel');
 const selected=sedes.find(s=>s.id===sedeId)??sedes[0]??null;
 if(!selected)return {sedes,selected,tipos:[] as RoomType[]};
 const db=await createClient();
 const types=await db.from('tipos_habitacion').select('id,sede_id,nombre,slug,descripcion_corta,descripcion_detallada,capacidad_personas,cantidad_camas,tipo_cama,precio_desde,imagen_principal,publicado,orden,comodidades').eq('sede_id',selected.id).order('orden',{ascending:true}).order('id',{ascending:true});
 if(types.error)throw new Error('No se pudieron leer las habitaciones. Ejecuta las políticas SQL del módulo.');
 return {sedes,selected,tipos:(types.data??[]) as RoomType[]};
}
