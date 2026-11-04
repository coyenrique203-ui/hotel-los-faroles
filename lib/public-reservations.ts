import 'server-only';
import {createClient} from '@/lib/supabase/server';

export type PublicReservationConfig={metodo:'whatsapp'|'externo';whatsapp_numero:string|null;url_externa:string|null;roomLinks:Record<number,string>};

export async function getPublicReservationConfig(slug:string):Promise<PublicReservationConfig|null>{
 try{
  const db=await createClient();
  const {data:sede,error}=await db.from('sedes').select('id').eq('slug',slug).eq('publicado',true).maybeSingle();
  if(error||!sede)return null;
  const {data:config,error:configError}=await db.from('config_reservas_sede').select('metodo,whatsapp_numero,url_externa').eq('sede_id',sede.id).maybeSingle();
  if(configError||!config||!['whatsapp','externo'].includes(config.metodo))return null;
  const {data:tipos}=await db.from('tipos_habitacion').select('id').eq('sede_id',sede.id).eq('publicado',true);
  let links:{tipo_habitacion_id:number;url_externa:string|null}[]=[];
  if(tipos?.length){
   const {data}=await db.from('enlaces_reserva_tipo').select('tipo_habitacion_id,url_externa').in('tipo_habitacion_id',tipos.map(t=>t.id));
   links=data??[];
  }
  return {...config,roomLinks:Object.fromEntries(links.filter(l=>l.url_externa).map(l=>[l.tipo_habitacion_id,l.url_externa!]))} as PublicReservationConfig;
 }catch{return null;}
}
