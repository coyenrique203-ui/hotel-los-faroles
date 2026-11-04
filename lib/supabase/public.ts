import 'server-only';
import {createClient,type SupabaseClient} from '@supabase/supabase-js';

let publicClient:SupabaseClient|null=null;

/** Cliente anónimo para contenido publicado; nunca utiliza cookies ni permisos del administrador. */
export function createPublicClient(){
 if(publicClient)return publicClient;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error('Falta configurar Supabase en .env.local');
 publicClient=createClient(url,key,{
  auth:{autoRefreshToken:false,persistSession:false,detectSessionInUrl:false},
 });
 return publicClient;
}
