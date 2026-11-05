'use server';

import {randomBytes,createHash} from 'node:crypto';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';

export type InviteResult={url:string;error:string};
const fail=(error:string):InviteResult=>({url:'',error});

export async function createReviewInvitation(_previous:InviteResult,form:FormData):Promise<InviteResult>{
 const admin=await requireAdmin();
 const sede=Number(form.get('sede_id'));
 const nombre=String(form.get('nombre')??'').trim().replace(/\s+/g,' ').slice(0,120);
 const fecha=String(form.get('fecha_salida')??'');
 const sedes=await getSedesForAdmin(admin);
 if(!Number.isSafeInteger(sede)||!sedes.some(s=>s.id===sede)||nombre.length<2||!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){
  return fail('Completa el nombre, el establecimiento y la fecha de visita o evento.');
 }
 const salida=new Date(fecha+'T12:00:00Z');
 const hoy=new Date();
 if(Number.isNaN(salida.getTime())||salida.getTime()>hoy.getTime()||hoy.getTime()-salida.getTime()>90*86400000){
  return fail('La visita o actividad debe haber ocurrido durante los últimos 90 días.');
 }
 const token=randomBytes(32).toString('hex');
 const hash=createHash('sha256').update(token).digest('hex');
 const expira=new Date(Date.now()+15*86400000).toISOString();
 const db=await createClient();
 const {error}=await db.from('invitaciones_resena').insert({
  sede_id:sede,token_hash:hash,nombre_huesped:nombre,fecha_salida:fecha,creado_por:admin.id,expira_en:expira,
 });
 if(error)return fail('No se pudo crear el enlace. Comprueba que ejecutaste el SQL de reseñas en Supabase.');
 revalidatePath('/admin/resenas');
 // Devolver el token una sola vez. Nunca se guarda en texto plano en la BD.
 return {url:'/resena/'+token,error:''};
}

export async function moderateReview(form:FormData){
 const admin=await requireAdmin();
 const id=Number(form.get('resena_id')),sede=Number(form.get('sede_id'));
 const estado=String(form.get('estado')??'');
 if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(sede)||!['publicada','rechazada'].includes(estado))return;
 const sedes=await getSedesForAdmin(admin);
 if(!sedes.some(s=>s.id===sede))return;
 const db=await createClient();
 await db.from('resenas_huespedes').update({
  estado,revisado_en:new Date().toISOString(),revisado_por:admin.id,
 }).eq('id',id).eq('sede_id',sede).eq('estado','pendiente');
 revalidatePath('/admin/resenas');
 revalidatePath('/admin/restaurante/'+sede);revalidatePath('/admin/eventos/'+sede);
 revalidatePath('/coban');revalidatePath('/antigua');
 const slug=sedes.find(s=>s.id===sede)?.slug;
 if(slug)revalidatePath('/sedes/'+slug);
}
