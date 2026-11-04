import 'server-only';
import {createClient} from '@/lib/supabase/server';

export type ReservaConfig={metodo:'whatsapp'|'externo';whatsapp_numero:string|null;mensaje_plantilla:string|null;url_externa:string|null};
export type ReservaTipo={id:number;nombre:string;url_externa:string|null};

export async function getReservaAdminData(sedeId:number,esHotel:boolean){
 const db=await createClient();
 const [config,tipos]=await Promise.all([
  db.from('config_reservas_sede').select('metodo,whatsapp_numero,mensaje_plantilla,url_externa').eq('sede_id',sedeId).maybeSingle(),
  esHotel?db.from('tipos_habitacion').select('id,nombre').eq('sede_id',sedeId).order('orden',{ascending:true}).order('id',{ascending:true}):Promise.resolve({data:[],error:null}),
 ]);
 if(config.error||tipos.error)throw new Error('No se pudo consultar la configuración de reservaciones. Ejecuta SQL 08.');
 const listado=(tipos.data??[]) as {id:number;nombre:string}[];
 let links:{tipo_habitacion_id:number;url_externa:string|null}[]=[];
 if(listado.length){
  const response=await db.from('enlaces_reserva_tipo').select('tipo_habitacion_id,url_externa').in('tipo_habitacion_id',listado.map(t=>t.id));
  if(response.error)throw new Error('No se pudieron consultar los enlaces de las habitaciones.');
  links=response.data??[];
 }
 const urls=new Map(links.map(l=>[l.tipo_habitacion_id,l.url_externa]));
 return {config:config.data as ReservaConfig|null,tipos:listado.map(t=>({...t,url_externa:urls.get(t.id)??null})) as ReservaTipo[]};
}
