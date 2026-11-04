import 'server-only';
import {createClient} from '@/lib/supabase/server';

export type Platillo={id:number;sede_id:number;categoria:string;nombre:string;descripcion:string|null;precio:number|null;imagen_url:string|null;publicado:boolean;orden:number};

export async function getPlatillos(sedeId:number,onlyPublished=false):Promise<Platillo[]>{
 const db=await createClient();
 let query=db.from('restaurante_platillos').select('id,sede_id,categoria,nombre,descripcion,precio,imagen_url,publicado,orden').eq('sede_id',sedeId);
 if(onlyPublished)query=query.eq('publicado',true);
 const {data,error}=await query.order('categoria',{ascending:true}).order('orden',{ascending:true}).order('id',{ascending:true});
 if(error){console.error('No se pudo cargar la carta del restaurante:',error.message);return [];}
 return (data??[]) as Platillo[];
}
