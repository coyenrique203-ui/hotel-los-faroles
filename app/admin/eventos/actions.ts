'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';
import {getR2} from '@/lib/r2/client';

const formats:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
async function authorized(id:number){
 const admin=await requireAdmin();
 const sede=(await getSedesForAdmin(admin)).find(s=>s.id===id&&s.tipo==='eventos');
 if(!sede)redirect('/admin/eventos?status=denegado');
 return sede;
}
function back(id:number,status:string){return '/admin/eventos/'+id+'?tab=actividades&status='+status;}
function valid(bytes:Uint8Array,mime:string){
 return mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:mime==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:mime==='image/webp'?new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP':false;
}
export async function createActivity(form:FormData){
 const id=Number(form.get('sede_id'));const sede=await authorized(id);
 const titulo=String(form.get('titulo')??'').trim().slice(0,160);
 const descripcion=String(form.get('descripcion')??'').trim().slice(0,1600)||null;
 const fecha=String(form.get('fecha_evento')??'');
 const files=form.getAll('fotos').filter((f):f is File=>f instanceof File&&f.size>0);
 if(titulo.length<3||(fecha&&!/^\d{4}-\d{2}-\d{2}$/.test(fecha))||files.length>8||!files.length||files.reduce((sum,file)=>sum+file.size,0)>24*1024*1024)redirect(back(id,'invalid'));
 const checked:{file:File;bytes:Uint8Array}[]=[];
 for(const file of files){
  if(file.size>8*1024*1024||!formats[file.type])redirect(back(id,'invalid'));
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!valid(bytes,file.type))redirect(back(id,'invalid'));
  checked.push({file,bytes});
 }
 const r2=getR2();if(!r2)redirect(back(id,'config'));
 const images:{key:string;url:string}[]=[];
 for(const {file,bytes} of checked){
  const key=`eventos/${sede.slug}/${crypto.randomUUID()}.${formats[file.type]}`;
  try{await r2.upload(key,bytes,file.type);images.push({key,url:r2.publicUrl(key)});}catch{
   for(const image of images)try{await r2.remove(image.key);}catch{}
   redirect(back(id,'r2'));
  }
 }
 const db=await createClient();
 const {data:row,error}=await db.from('actividades_eventos').insert({sede_id:id,titulo,descripcion,fecha_evento:fecha||null,publicado:form.get('publicado')==='on'}).select('id').single();
 if(error||!row){for(const image of images)try{await r2.remove(image.key);}catch{}redirect(back(id,'error'));}
 const {error:photoError}=await db.from('actividades_eventos_fotos').insert(images.map((image,index)=>({actividad_id:row.id,url_publica:image.url,clave_r2:image.key,orden:index})));
 if(photoError){
  await db.from('actividades_eventos').delete().eq('id',row.id);
  for(const image of images)try{await r2.remove(image.key);}catch{}
  redirect(back(id,'error'));
 }
 revalidatePath('/admin/eventos');revalidatePath('/admin/eventos/'+id);revalidatePath('/eventos');revalidatePath('/sedes/'+sede.slug);
 redirect(back(id,'created'));
}
export async function changeActivity(form:FormData){
 const id=Number(form.get('sede_id')),activityId=Number(form.get('id'));
 const sede=await authorized(id);
 if(!Number.isSafeInteger(activityId)||activityId<1)redirect(back(id,'invalid'));
 const op=String(form.get('accion')??'');
 const db=await createClient();
 const {data:item}=await db.from('actividades_eventos').select('id').eq('id',activityId).eq('sede_id',id).maybeSingle();
 if(!item)redirect(back(id,'denegado'));
 if(op==='publish'||op==='hide'){
  const {error}=await db.from('actividades_eventos').update({publicado:op==='publish'}).eq('id',activityId).eq('sede_id',id);
  if(error)redirect(back(id,'error'));
 }else if(op==='delete'){
  const {data:images,error:listError}=await db.from('actividades_eventos_fotos').select('clave_r2').eq('actividad_id',activityId);
  if(listError)redirect(back(id,'error'));
  const {error}=await db.from('actividades_eventos').delete().eq('id',activityId).eq('sede_id',id);
  if(error)redirect(back(id,'error'));
  const r2=getR2();
  if(r2)for(const image of images??[])try{await r2.remove(image.clave_r2);}catch{console.warn('Quedó una imagen sin borrar en R2:',image.clave_r2);}
 }else redirect(back(id,'invalid'));
 revalidatePath('/admin/eventos');revalidatePath('/eventos');revalidatePath('/sedes/'+sede.slug);
 redirect(back(id,'saved'));
}
