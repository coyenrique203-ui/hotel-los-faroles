import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';

export type HomeSlide={url:string;clave_r2:string};
export type HomeCover={
 modo:'video'|'imagen'|'carrusel';
 video_url:string|null;video_clave_r2:string|null;
 imagen_url:string|null;imagen_clave_r2:string|null;
 carrusel:HomeSlide[];
};
export const emptyHomeCover:HomeCover={modo:'video',video_url:null,video_clave_r2:null,imagen_url:null,imagen_clave_r2:null,carrusel:[]};

export async function getHomeCover():Promise<HomeCover>{
 try{
  const db=createPublicClient();
  const {data,error}=await db.from('portada_principal').select('modo,video_url,video_clave_r2,imagen_url,imagen_clave_r2,carrusel').eq('id',1).maybeSingle();
  if(error||!data)return emptyHomeCover;
  const slides=Array.isArray(data.carrusel)?data.carrusel.filter((slide:unknown):slide is HomeSlide=>typeof slide==='object'&&slide!==null&&typeof (slide as HomeSlide).url==='string'&&(slide as HomeSlide).url.startsWith('https://')&&typeof (slide as HomeSlide).clave_r2==='string').slice(0,8):[];
  return {modo:data.modo==='imagen'||data.modo==='carrusel'?data.modo:'video',video_url:data.video_url??null,video_clave_r2:data.video_clave_r2??null,imagen_url:data.imagen_url??null,imagen_clave_r2:data.imagen_clave_r2??null,carrusel:slides};
 }catch{return emptyHomeCover;}
}
