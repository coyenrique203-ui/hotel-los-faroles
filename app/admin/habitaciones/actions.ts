'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';

const val=(f:FormData,k:string,max=500)=>{const v=f.get(k);return typeof v==='string'?v.trim().slice(0,max):''};
const destination=(sede:number,status:string)=>`/admin/habitaciones?sede=${sede}&status=${status}`;
function validId(id:number){return Number.isSafeInteger(id)&&id>0;}
async function authorizedHotel(sedeId:number){
 const admin=await requireAdmin();
 const sedes=await getSedesForAdmin(admin);
 const hotel=sedes.find(s=>s.id===sedeId&&s.tipo==='hotel');
 if(!validId(sedeId)||!hotel)redirect('/admin/habitaciones?status=denegado');
 return {db:await createClient(),slug:hotel.slug};
}

export async function saveRoomType(form:FormData){
 const sede=Number(form.get('sede_id'));const {db,slug:sedeSlug}=await authorizedHotel(sede);
 const id=Number(form.get('id')||0);
 const nombre=val(form,'nombre',150),slug=val(form,'slug',150).toLowerCase();
 const capacidad=Number(form.get('capacidad_personas')),camas=Number(form.get('cantidad_camas'));
 const precioTexto=val(form,'precio_desde',20),precio=precioTexto?Number(precioTexto):null;
 const imagen=val(form,'imagen_principal',2000);
 const comodidades=[...new Set(form.getAll('comodidad').filter((value):value is string=>typeof value==='string').map(value=>value.trim()).filter(value=>value.length>0&&value.length<=60))].slice(0,40);
 if(!nombre||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||!Number.isInteger(capacidad)||capacidad<1||capacidad>50||!Number.isInteger(camas)||camas<1||camas>30||(precio!==null&&(!Number.isFinite(precio)||precio<0))||(imagen&&!/^https:\/\//.test(imagen)))redirect(destination(sede,'invalid'));
 const record={sede_id:sede,nombre,slug,descripcion_corta:val(form,'descripcion_corta',1000)||null,descripcion_detallada:val(form,'descripcion_detallada',5000)||null,capacidad_personas:capacidad,cantidad_camas:camas,tipo_cama:val(form,'tipo_cama',120)||null,precio_desde:precio,imagen_principal:imagen||null,comodidades,publicado:form.get('publicado')==='on'};
 let error;
 if(validId(id)){
  const result=await db.from('tipos_habitacion').update(record).eq('id',id).eq('sede_id',sede).select('id').maybeSingle();
  error=result.error||(!result.data?new Error('No autorizado'):null);
 }else{
  const result=await db.from('tipos_habitacion').insert(record).select('id').maybeSingle();
  error=result.error||(!result.data?new Error('No insertado'):null);
 }
 if(error)redirect(destination(sede,'saveerror'));
 revalidatePath('/admin/habitaciones');revalidatePath('/coban');revalidatePath('/antigua');
 revalidatePath(`/sedes/${sedeSlug}`);
 redirect(destination(sede,'saved'));
}

