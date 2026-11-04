'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {createClient} from '@/lib/supabase/server';

const clean=(form:FormData,key:string,max:number)=>{
 const v=form.get(key);
 return typeof v==='string'?v.trim().slice(0,max):'';
};

export async function createSedeAction(formData:FormData){
 const admin=await requireAdmin();
 if(admin.rol!=='general')redirect('/admin/sedes?status=denegado');
 const nombre=clean(formData,'nombre',150);
 const tipo=clean(formData,'tipo',30);
 const direccion=clean(formData,'direccion',500);
 const maps=clean(formData,'google_maps_url',2000);
 if(maps&&!/^https:\/\/(maps\.app\.goo\.gl|www\.google\.com|google\.com)\//.test(maps))redirect('/admin/sedes?status=invalid');
 if(nombre.length<3||!['hotel','restaurante','eventos'].includes(tipo))redirect('/admin/sedes?status=invalid');

 const baseSlug=nombre.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
 if(!baseSlug)redirect('/admin/sedes?status=invalid');
 const db=await createClient();
 const {data:existing,error:lookupError}=await db.from('sedes').select('slug').like('slug',`${baseSlug}%`);
 if(lookupError)redirect('/admin/sedes?status=error');
 const used=new Set((existing??[]).map(item=>item.slug));
 let slug=baseSlug;
 for(let suffix=2;used.has(slug)&&suffix<1000;suffix++)slug=`${baseSlug}-${suffix}`;
 if(used.has(slug))redirect('/admin/sedes?status=error');

 const {data,error}=await db.from('sedes').insert({
  nombre,slug,tipo,direccion:direccion||null,google_maps_url:maps||null,publicado:false,
 }).select('id').single();
 if(error||!data)redirect('/admin/sedes?status=error');
 revalidatePath('/admin/sedes');
 revalidatePath('/');
 redirect(`/admin/sedes/${data.id}`);
}

export async function updateSedeAction(formData:FormData){
 const admin=await requireAdmin();
 const id=Number(formData.get('id'));
 if(!Number.isSafeInteger(id)||id<1)redirect('/admin/sedes');
 const fail=(reason:string)=>`/admin/sedes/${id}?status=${reason}`;
 const nombre=clean(formData,'nombre',150);
 const email=clean(formData,'email',254);
 const whatsapp=clean(formData,'whatsapp',50);
 const telefono=clean(formData,'telefono',50);
 const telefono2=clean(formData,'telefono_2',50);
 const telefono3=clean(formData,'telefono_3',50);
 const googleMapsUrl=clean(formData,'google_maps_url',2000);
 const ratingText=clean(formData,'google_rating',10),countText=clean(formData,'google_reviews_count',15);
 const rating=ratingText?Number(ratingText):null,count=countText?Number(countText):null;
 const validReviews=(rating===null||Number.isFinite(rating)&&rating>=1&&rating<=5)
   &&(count===null||Number.isSafeInteger(count)&&count>=0)
   &&((rating===null)===(count===null));
 let validMaps=true;
 if(googleMapsUrl){
  try{
   const parsed=new URL(googleMapsUrl);
   validMaps=parsed.protocol==='https:'&&(
    parsed.hostname==='maps.app.goo.gl'||parsed.hostname==='goo.gl'&&parsed.pathname.startsWith('/maps/')||
    (parsed.hostname==='google.com'||parsed.hostname.endsWith('.google.com'))&&parsed.pathname.startsWith('/maps')
   );
  }catch{validMaps=false;}
 }
 if(!nombre||nombre.length<2|| (email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||
    !validMaps||!validReviews||[telefono,telefono2,telefono3,whatsapp].some(v=>/[^+\d ()-]/.test(v)))redirect(fail('error'));

 const supabase=await createClient();
 // Comprobación explícita; la política RLS también filtra esta lectura y la escritura.
 const {data:existing,error:readError}=await supabase.from('sedes').select('id').eq('id',id).maybeSingle();
 if(readError||!existing)redirect(fail('denegado'));
 if(admin.rol==='sede'){
  const {data:assignment,error}=await supabase.from('admin_sedes').select('id').eq('admin_id',admin.id).eq('sede_id',id).maybeSingle();
  if(error||!assignment)redirect(fail('denegado'));
 }
 const {data,error}=await supabase.from('sedes').update({
   nombre,descripcion:clean(formData,'descripcion',3000)||null,
   direccion:clean(formData,'direccion',500)||null,
   telefono:telefono||null,telefonos_adicionales:[telefono2,telefono3].filter(Boolean),
   google_maps_url:googleMapsUrl||null,google_rating:rating,google_reviews_count:count,google_reviews_checked_at:rating!==null?new Date().toISOString():null,whatsapp:whatsapp||null,email:email||null,
   publicado:formData.get('publicado')==='on',
 }).eq('id',id).select('id').maybeSingle();
 if(error||!data)redirect(fail('error'));
 revalidatePath('/admin/sedes');revalidatePath(`/admin/sedes/${id}`);
 revalidatePath('/');
 redirect(fail('ok'));
}
