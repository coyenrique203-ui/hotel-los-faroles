import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';

export type HomeCover={video_url:string|null;video_clave_r2:string|null};

export async function getHomeCover():Promise<HomeCover>{
 try{
  const db=createPublicClient();
  const {data,error}=await db.from('portada_principal').select('video_url,video_clave_r2').eq('id',1).maybeSingle();
  if(error||!data)return {video_url:null,video_clave_r2:null};
  return data as HomeCover;
 }catch{return {video_url:null,video_clave_r2:null};}
}
