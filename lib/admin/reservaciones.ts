import 'server-only';
import {createClient} from '@/lib/supabase/server';

export type ReservaConfig={metodo:'whatsapp'|'externo';whatsapp_numero:string|null;mensaje_plantilla:string|null;url_externa:string|null};

export async function getReservaAdminData(sedeId:number){
 const db=await createClient();
 const {data,error}=await db.from('config_reservas_sede')
  .select('metodo,whatsapp_numero,mensaje_plantilla,url_externa')
  .eq('sede_id',sedeId).maybeSingle();
 if(error)throw new Error('No se pudo consultar la configuración de reservaciones.');
 return {config:data as ReservaConfig|null};
}
