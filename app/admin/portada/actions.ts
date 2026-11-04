'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {createClient} from '@/lib/supabase/server';
import {getR2} from '@/lib/r2/client';

const MAX_BYTES=25*1024*1024;
const to=(status:string)=>`/admin/portada?status=${status}`;

export async function uploadHomeVideo(form:FormData){
 const admin=await requireAdmin();
 if(admin.rol!=='general')redirect(to('denegado'));
 const file=form.get('video');
 if(!(file instanceof File)||file.size<12||file.size>MAX_BYTES||file.type!=='video/mp4')redirect(to('archivo'));
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(new TextDecoder().decode(bytes.slice(4,8))!=='ftyp')redirect(to('archivo'));
 const r2=getR2();
 if(!r2)redirect(to('config'));
 const key=`portada-principal/${crypto.randomUUID()}.mp4`;
 const db=await createClient();
 const {data:current,error:readError}=await db.from('portada_principal').select('video_clave_r2').eq('id',1).maybeSingle();
 if(readError||!current)redirect(to('tabla'));
 try{await r2.upload(key,bytes,'video/mp4');}catch{redirect(to('r2'));}
 const {data:saved,error}=await db.from('portada_principal')
  .update({video_url:r2.publicUrl(key),video_clave_r2:key,actualizado_en:new Date().toISOString()})
  .eq('id',1).select('id').maybeSingle();
 if(error||!saved){try{await r2.remove(key);}catch{}redirect(to('db'));}
 revalidatePath('/');revalidatePath('/admin/portada');
 if(current.video_clave_r2&&current.video_clave_r2!==key){
  try{await r2.remove(current.video_clave_r2);}catch{/* No interrumpir: el video nuevo ya está guardado. */}
 }
 redirect(to('ok'));
}
