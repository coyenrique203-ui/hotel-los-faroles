'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedeForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';

const clean=(form:FormData,key:string,max:number)=>{const v=form.get(key);return typeof v==='string'?v.trim().slice(0,max):'';};
function validUrl(value:string){if(!value)return true;try{const url=new URL(value);return url.protocol==='https:'&&!!url.hostname&&!url.username&&!url.password;}catch{return false;}}

export async function saveReservasSede(form:FormData){
 const admin=await requireAdmin();const id=Number(form.get('sede_id'));
 if(!Number.isSafeInteger(id)||id<1)redirect('/admin/sedes');
 const back=(status:string)=>`/admin/sedes/${id}?tab=reservas&status=${status}`;
 const sede=await getSedeForAdmin(admin,id);if(!sede)redirect(back('denegado'));
 const metodo=clean(form,'metodo',20);
 const numero=clean(form,'whatsapp_numero',30).replace(/[^\d]/g,'');
 const mensaje=clean(form,'mensaje_plantilla',1000);
 const url=clean(form,'url_externa',2000);
 if(!['whatsapp','externo'].includes(metodo)||(metodo==='whatsapp'&&!/^\d{8,15}$/.test(numero))||(metodo==='externo'&&!url)||!validUrl(url))redirect(back('invalid'));
 const db=await createClient();
 const {error}=await db.from('config_reservas_sede').upsert({sede_id:id,metodo,whatsapp_numero:numero||null,mensaje_plantilla:mensaje||null,url_externa:url||null,actualizado_en:new Date().toISOString()},{onConflict:'sede_id'});
 if(error)redirect(back('error'));
 revalidatePath(`/admin/sedes/${id}`);revalidatePath('/');revalidatePath(`/sedes/${sede.slug}`);
 redirect(back('ok'));
}
