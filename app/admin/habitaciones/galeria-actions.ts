'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getRoomGallery} from '@/lib/admin/galeria-habitaciones';
import {createClient} from '@/lib/supabase/server';
import {getR2} from '@/lib/r2/client';

const path=(id:number,status:string)=>`/admin/habitaciones/${id}/galeria?status=${status}`;
const ext:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
const field=(f:FormData,k:string,n:number)=>{const v=f.get(k);return typeof v==='string'?v.trim().slice(0,n):'';};

async function access(id:number){
 if(!Number.isSafeInteger(id)||id<1)redirect('/admin/habitaciones');
 const admin=await requireAdmin();
 const gallery=await getRoomGallery(admin,id);
 if(!gallery)redirect('/admin/habitaciones?status=denegado');
 return gallery;
}
function validFile(bytes:Uint8Array,type:string){
 if(type==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(type==='image/png')return bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
 if(type==='image/webp')return new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 return false;
}
function refresh(typeId:number,slug:string){
 revalidatePath(`/admin/habitaciones/${typeId}/galeria`);revalidatePath('/admin/habitaciones');
 revalidatePath(`/${slug}`);revalidatePath('/');
}

export async function uploadRoomPhoto(f:FormData){
 const id=Number(f.get('tipo_id'));const {tipo,sede}=await access(id);
 const file=f.get('imagen');
 if(!(file instanceof File)||file.size<1||file.size>8*1024*1024||!ext[file.type])redirect(path(id,'archivo'));
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(!validFile(bytes,file.type))redirect(path(id,'archivo'));
 const r2=getR2();if(!r2)redirect(path(id,'config'));
 const key=`habitaciones/${sede.slug}/${tipo.slug}/${crypto.randomUUID()}.${ext[file.type]}`;
 try{await r2.upload(key,bytes,file.type);}catch{redirect(path(id,'r2'));}
 const db=await createClient();
 const {data:last}=await db.from('imagenes').select('orden').eq('tipo_habitacion_id',id).is('sede_id',null).order('orden',{ascending:false}).limit(1).maybeSingle();
 const {error}=await db.from('imagenes').insert({
  sede_id:null,tipo_habitacion_id:id,titulo:field(f,'titulo',150)||null,
  texto_alternativo:field(f,'texto_alternativo',255)||null,
  nombre_archivo:file.name.slice(0,255),clave_r2:key,url_publica:r2.publicUrl(key),
  destacada:false,publicada:true,orden:(last?.orden??0)+1,
 });
 if(error){try{await r2.remove(key);}catch{}redirect(path(id,'db'));}
 refresh(id,sede.slug);redirect(path(id,'subida'));
}

export async function changeRoomPhoto(f:FormData){
 const typeId=Number(f.get('tipo_id'));
 const {tipo,sede,imagenes}=await access(typeId);
 const photoId=Number(f.get('imagen_id'));
 const photo=imagenes.find(p=>p.id===photoId);
 if(!photo)redirect(path(typeId,'error'));
 const action=f.get('operacion');const db=await createClient();
 if(action==='destacar'){
  const {error:clear}=await db.from('imagenes').update({destacada:false}).eq('tipo_habitacion_id',typeId).eq('destacada',true);
  if(clear)redirect(path(typeId,'error'));
  const {error:mark}=await db.from('imagenes').update({destacada:true,publicada:true}).eq('id',photoId).eq('tipo_habitacion_id',typeId);
  if(mark)redirect(path(typeId,'error'));
  const {error:typeError}=await db.from('tipos_habitacion').update({imagen_principal:photo.url_publica}).eq('id',typeId).eq('sede_id',sede.id);
  if(typeError)redirect(path(typeId,'error'));
 }else if(action==='ocultar'||action==='mostrar'){
  const {error}=await db.from('imagenes').update({publicada:action==='mostrar',destacada:action==='ocultar'?false:photo.destacada}).eq('id',photoId).eq('tipo_habitacion_id',typeId);
  if(error)redirect(path(typeId,'error'));
  if(action==='ocultar'&&tipo.imagen_principal===photo.url_publica)await db.from('tipos_habitacion').update({imagen_principal:null}).eq('id',typeId).eq('sede_id',sede.id);
 }else if(action==='subir'||action==='bajar'){
  const index=imagenes.findIndex(i=>i.id===photoId);
  const other=imagenes[index+(action==='subir'?-1:1)];
  if(!other)redirect(path(typeId,'error'));
  const [first,second]=await Promise.all([
   db.from('imagenes').update({orden:other.orden}).eq('id',photoId).eq('tipo_habitacion_id',typeId),
   db.from('imagenes').update({orden:photo.orden}).eq('id',other.id).eq('tipo_habitacion_id',typeId),
  ]);
  if(first.error||second.error)redirect(path(typeId,'error'));
 }else if(action==='eliminar'){
  const r2=getR2();if(!r2)redirect(path(typeId,'config'));
  const {error}=await db.from('imagenes').delete().eq('id',photoId).eq('tipo_habitacion_id',typeId);
  if(error)redirect(path(typeId,'error'));
  if(tipo.imagen_principal===photo.url_publica)await db.from('tipos_habitacion').update({imagen_principal:null}).eq('id',typeId).eq('sede_id',sede.id);
  try{await r2.remove(photo.clave_r2);}catch{refresh(typeId,sede.slug);redirect(path(typeId,'r2delete'));}
 }else redirect(path(typeId,'error'));
 refresh(typeId,sede.slug);redirect(path(typeId,'guardado'));
}
