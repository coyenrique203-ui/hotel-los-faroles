'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';

function field(form:FormData,key:string,max:number){return String(form.get(key)??'').trim().slice(0,max);}
function urlOrNull(value:string){if(!value)return null;try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.toString():null;}catch{return null;}}

export async function savePlatillo(form:FormData){
 const admin=await requireAdmin();
 const sedeId=Number(form.get('sede_id')),id=Number(form.get('id')||0);
 const allowed=(await getSedesForAdmin(admin)).find(s=>s.id===sedeId&&s.tipo==='restaurante');
 if(!allowed)redirect('/admin/restaurante?status=denegado');
 const base='/admin/restaurante?sede='+sedeId;
 const nombre=field(form,'nombre',150),categoria=field(form,'categoria',80);
 const descripcion=field(form,'descripcion',500)||null;
 const precioTxt=field(form,'precio',20);
 const precio=precioTxt===''?null:Number(precioTxt);
 const imagenTxt=field(form,'imagen_url',2048),imagen=urlOrNull(imagenTxt);
 const orden=Number(form.get('orden')??0);
 if(nombre.length<2||!categoria||categoria.length>80||(precio!==null&&(!Number.isFinite(precio)||precio<0||precio>99999999))||(imagenTxt&&!imagen)||!Number.isSafeInteger(orden)||Math.abs(orden)>100000)redirect(base+'&status=invalid');
 const record={nombre,categoria,descripcion,precio,imagen_url:imagen,orden,publicado:form.get('publicado')==='on'};
 const db=await createClient();
 if(id>0){
  if(!Number.isSafeInteger(id))redirect(base+'&status=invalid');
  const {error}=await db.from('restaurante_platillos').update(record).eq('id',id).eq('sede_id',sedeId);
  if(error)redirect(base+'&status=error');
 }else{
  const {error}=await db.from('restaurante_platillos').insert({...record,sede_id:sedeId});
  if(error)redirect(base+'&status=error');
 }
 revalidatePath('/admin/restaurante');
 revalidatePath('/sedes/'+allowed.slug);
 revalidatePath('/restaurante');
 redirect(base+'&status=ok');
}

export async function deletePlatillo(form:FormData){
 const admin=await requireAdmin();
 const sedeId=Number(form.get('sede_id')),id=Number(form.get('id'));
 const allowed=(await getSedesForAdmin(admin)).find(s=>s.id===sedeId&&s.tipo==='restaurante');
 if(!allowed||!Number.isSafeInteger(id)||id<1)redirect('/admin/restaurante?status=denegado');
 const db=await createClient();
 const {error}=await db.from('restaurante_platillos').delete().eq('id',id).eq('sede_id',sedeId);
 if(error)redirect('/admin/restaurante?sede='+sedeId+'&status=error');
 revalidatePath('/admin/restaurante');
 revalidatePath('/sedes/'+allowed.slug);
 revalidatePath('/restaurante');
 redirect('/admin/restaurante?sede='+sedeId+'&status=deleted');
}
