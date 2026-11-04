'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';
import {getR2} from '@/lib/r2/client';

const MAX_BYTES=8*1024*1024;
const formats:{[key:string]:string}={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
const url=(id:number,status:string,returnTo?:FormDataEntryValue|null)=>returnTo==='sede'?`/admin/sedes/${id}?tab=fotos&status=${status}`:`/admin/galeria?sede=${id}&status=${status}`;
const optional=(f:FormData,key:string,max:number)=>{const v=f.get(key);return typeof v==='string'?v.trim().slice(0,max):'';};

async function authorize(sedeId:number){
 const admin=await requireAdmin();
 if(!Number.isSafeInteger(sedeId)||sedeId<1)redirect('/admin/galeria');
 const sedes=await getSedesForAdmin(admin);
 const sede=sedes.find(s=>s.id===sedeId);
 if(!sede)redirect('/admin/galeria?status=denegado');
 return sede;
}

function verifyBytes(bytes:Uint8Array,mime:string){
 if(mime==='image/jpeg')return bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
 if(mime==='image/png')return bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47;
 if(mime==='image/webp')return new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 return false;
}

export async function uploadGalleryImage(form:FormData){
 const sedeId=Number(form.get('sede_id'));
 const back=form.get('return_to');
 const sede=await authorize(sedeId);
 const file=form.get('imagen');
 if(!(file instanceof File)||file.size===0||file.size>MAX_BYTES||!formats[file.type])redirect(url(sedeId,'archivo',back));
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(!verifyBytes(bytes,file.type))redirect(url(sedeId,'archivo',back));
 const key=`sedes/${sede.slug}/${crypto.randomUUID()}.${formats[file.type]}`;
 const r2=getR2();
 if(!r2)redirect(url(sedeId,'config',back));
 const db=await createClient();
 try{
  await r2.upload(key,bytes,file.type);
 }catch{redirect(url(sedeId,'r2',back));}
 const {data:existingFeatured,error:featuredError}=await db.from('imagenes').select('id').eq('sede_id',sedeId).eq('destacada',true).limit(1);
 if(featuredError)redirect(url(sedeId,'error',back));
 const makeFeatured=!existingFeatured?.length;
 const {data:last}=await db.from('imagenes').select('orden').eq('sede_id',sedeId).order('orden',{ascending:false}).limit(1).maybeSingle();
 const {error}=await db.from('imagenes').insert({
  sede_id:sedeId,tipo_habitacion_id:null,
  titulo:optional(form,'titulo',150)||null,
  texto_alternativo:optional(form,'texto_alternativo',255)||null,
  nombre_archivo:file.name.slice(0,255),clave_r2:key,url_publica:r2.publicUrl(key),
  destacada:makeFeatured,publicada:true,orden:(last?.orden??0)+1,
 });
 if(error){try{await r2.remove(key);}catch{}redirect(url(sedeId,'db',back));}
 if(makeFeatured){const {error:coverError}=await db.from('sedes').update({imagen_principal:r2.publicUrl(key)}).eq('id',sedeId);if(coverError)redirect(url(sedeId,'error',back));}
 revalidatePath('/admin/galeria');revalidatePath(`/admin/sedes/${sedeId}`);revalidatePath('/');revalidatePath(`/${sede.slug}`);
 redirect(url(sedeId,'subida',back));
}

export async function changeGalleryImage(form:FormData){
 const back=form.get('return_to');
 const sedeId=Number(form.get('sede_id'));await authorize(sedeId);
 const imageId=Number(form.get('imagen_id'));
 if(!Number.isSafeInteger(imageId)||imageId<1)redirect(url(sedeId,'error',back));
 const db=await createClient();
 const {data:existing}=await db.from('imagenes').select('id,url_publica,clave_r2').eq('sede_id',sedeId).eq('id',imageId).maybeSingle();
 if(!existing)redirect(url(sedeId,'denegado',back));
 const operation=form.get('operacion');
 if(operation==='destacar'){
  const {error:clearError}=await db.from('imagenes').update({destacada:false}).eq('sede_id',sedeId).eq('destacada',true);
  if(clearError)redirect(url(sedeId,'error',back));
  const {error}=await db.from('imagenes').update({destacada:true,publicada:true}).eq('id',imageId).eq('sede_id',sedeId);
  if(error)redirect(url(sedeId,'error',back));
  const {error:sedeError}=await db.from('sedes').update({imagen_principal:existing.url_publica}).eq('id',sedeId);
  if(sedeError)redirect(url(sedeId,'error',back));
 }else if(operation==='ocultar'||operation==='mostrar'){
  const {error}=await db.from('imagenes').update({publicada:operation==='mostrar'}).eq('id',imageId).eq('sede_id',sedeId);
  if(error)redirect(url(sedeId,'error',back));
 }else if(operation==='eliminar'){
  const r2=getR2();
  if(!r2)redirect(url(sedeId,'config',back));
  const {error}=await db.from('imagenes').delete().eq('id',imageId).eq('sede_id',sedeId);
  if(error)redirect(url(sedeId,'error',back));
  try{await r2.remove(existing.clave_r2);}catch{
   // La fila se eliminó, pero podría quedar un objeto huérfano en R2.
   revalidatePath('/admin/galeria');redirect(url(sedeId,'r2delete',back));
  }
  const {data:sede}=await db.from('sedes').select('imagen_principal').eq('id',sedeId).maybeSingle();
  if(sede?.imagen_principal===existing.url_publica)await db.from('sedes').update({imagen_principal:null}).eq('id',sedeId);
 }else redirect(url(sedeId,'error',back));
 revalidatePath('/admin/galeria');revalidatePath(`/admin/sedes/${sedeId}`);revalidatePath('/');
 redirect(url(sedeId,'guardado',back));
}
