'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {createClient} from '@/lib/supabase/server';
import {getR2} from '@/lib/r2/client';
import type {HomeSlide} from '@/lib/portada-principal';

const MAX_VIDEO=25*1024*1024,MAX_IMAGE=8*1024*1024,MAX_SLIDES_BYTES=24*1024*1024,MAX_SLIDES=8;
const to=(status:string)=>`/admin/portada?status=${status}`;
type CoverRow={video_clave_r2:string|null;video_url:string|null;imagen_clave_r2:string|null;imagen_url:string|null;modo:string;carrusel:HomeSlide[]|null};
async function authorized(){
 const admin=await requireAdmin();
 if(admin.rol!=='general')redirect(to('denegado'));
 const db=await createClient();
 const {data,error}=await db.from('portada_principal').select('video_clave_r2,video_url,imagen_clave_r2,imagen_url,modo,carrusel').eq('id',1).maybeSingle();
 if(error||!data)redirect(to('tabla'));
 return {db,current:data as CoverRow};
}
function updated(){revalidatePath('/');revalidatePath('/admin/portada');}
function validateImage(file:File){
 if(file.size<=0||file.size>MAX_IMAGE||!['image/jpeg','image/png','image/webp'].includes(file.type))return false;
 return true;
}
async function fileBytes(file:File){
 const bytes=new Uint8Array(await file.arrayBuffer());
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 if(!(file.type==='image/jpeg'&&jpeg||file.type==='image/png'&&png||file.type==='image/webp'&&webp))redirect(to('archivo'));
 return bytes;
}
function extension(file:File){return file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';}

export async function setHomeCoverMode(form:FormData){
 const modo=form.get('modo');
 if(modo!=='video'&&modo!=='imagen'&&modo!=='carrusel')redirect(to('invalid'));
 const {db,current}=await authorized();
 if(modo==='imagen'&&!current.imagen_url)redirect(to('sinimagen'));
 if(modo==='carrusel'&&!(Array.isArray(current.carrusel)&&current.carrusel.length))redirect(to('sinfotos'));
 const {error}=await db.from('portada_principal').update({modo,actualizado_en:new Date().toISOString()}).eq('id',1);
 if(error)redirect(to('db'));
 updated();
 redirect(to('modo'));
}

export async function uploadHomeVideo(form:FormData){
 const {db,current}=await authorized();
 const file=form.get('video');
 if(!(file instanceof File)||file.size<12||file.size>MAX_VIDEO||file.type!=='video/mp4')redirect(to('videoarchivo'));
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(new TextDecoder().decode(bytes.slice(4,8))!=='ftyp')redirect(to('videoarchivo'));
 const r2=getR2();
 if(!r2)redirect(to('config'));
 const key=`portada-principal/${crypto.randomUUID()}.mp4`;
 try{await r2.upload(key,bytes,'video/mp4');}catch{redirect(to('r2'));}
 const {error}=await db.from('portada_principal').update({modo:'video',video_url:r2.publicUrl(key),video_clave_r2:key,actualizado_en:new Date().toISOString()}).eq('id',1);
 if(error){try{await r2.remove(key);}catch{}redirect(to('db'));}
 updated();
 if(current.video_clave_r2&&current.video_clave_r2!==key)try{await r2.remove(current.video_clave_r2);}catch{}
 redirect(to('video'));
}

export async function uploadHomeImage(form:FormData){
 const {db,current}=await authorized();
 const file=form.get('imagen');
 if(!(file instanceof File)||!validateImage(file))redirect(to('archivo'));
 const bytes=await fileBytes(file);
 const r2=getR2();
 if(!r2)redirect(to('config'));
 const key=`portada-principal/${crypto.randomUUID()}.${extension(file)}`;
 try{await r2.upload(key,bytes,file.type);}catch{redirect(to('r2'));}
 const {error}=await db.from('portada_principal').update({modo:'imagen',imagen_url:r2.publicUrl(key),imagen_clave_r2:key,actualizado_en:new Date().toISOString()}).eq('id',1);
 if(error){try{await r2.remove(key);}catch{}redirect(to('db'));}
 updated();
 if(current.imagen_clave_r2&&current.imagen_clave_r2!==key)try{await r2.remove(current.imagen_clave_r2);}catch{}
 redirect(to('imagen'));
}

export async function uploadHomeSlides(form:FormData){
 const files=form.getAll('imagenes').filter((file):file is File=>file instanceof File&&file.size>0);
 if(!files.length||files.length>MAX_SLIDES||files.some(file=>!validateImage(file))||files.reduce((sum,file)=>sum+file.size,0)>MAX_SLIDES_BYTES)redirect(to('archivo'));
 const {db,current}=await authorized(),r2=getR2();
 if(!r2)redirect(to('config'));
 const existing=Array.isArray(current.carrusel)?current.carrusel:[];
 if(existing.length+files.length>MAX_SLIDES)redirect(to('limite'));
 const prepared=await Promise.all(files.map(async file=>({file,bytes:await fileBytes(file)})));
 const uploaded:HomeSlide[]=[];
 try{
  for(const {file,bytes} of prepared){
   const key=`portada-principal/carrusel/${crypto.randomUUID()}.${extension(file)}`;
   await r2.upload(key,bytes,file.type);
   uploaded.push({url:r2.publicUrl(key),clave_r2:key});
  }
 }catch{
  await Promise.all(uploaded.map(slide=>r2.remove(slide.clave_r2).catch(()=>{})));
  redirect(to('r2'));
 }
 const {error}=await db.from('portada_principal').update({modo:'carrusel',carrusel:[...existing,...uploaded],actualizado_en:new Date().toISOString()}).eq('id',1);
 if(error){await Promise.all(uploaded.map(slide=>r2.remove(slide.clave_r2).catch(()=>{})));redirect(to('db'));}
 updated();
 redirect(to('carrusel'));
}

export async function removeHomeSlide(form:FormData){
 const key=form.get('clave_r2');
 if(typeof key!=='string'||!key.startsWith('portada-principal/carrusel/'))redirect(to('invalid'));
 const {db,current}=await authorized();
 const slides=Array.isArray(current.carrusel)?current.carrusel:[];
 if(!slides.some(slide=>slide.clave_r2===key))redirect(to('invalid'));
 const remaining=slides.filter(slide=>slide.clave_r2!==key);
 const fallback=remaining.length?'carrusel':current.imagen_url?'imagen':'video';
 const {error}=await db.from('portada_principal').update({carrusel:remaining,modo:current.modo==='carrusel'?fallback:current.modo,actualizado_en:new Date().toISOString()}).eq('id',1);
 if(error)redirect(to('db'));
 updated();
 const r2=getR2();
 if(r2)try{await r2.remove(key);}catch{}
 redirect(to('eliminada'));
}
