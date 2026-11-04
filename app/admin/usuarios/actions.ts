'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/auth/require-admin';
import {adminAuthClient} from '@/lib/admin/user-service';

async function generalOnly(){
 const admin=await requireAdmin();
 if(admin.rol!=='general')redirect('/admin');
 const db=adminAuthClient();
 if(!db)throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.');
 return {admin,db};
}
function selectedSedes(form:FormData){
 return [...new Set(form.getAll('sedes').map(Number).filter(n=>Number.isSafeInteger(n)&&n>0))];
}

export type UserActionState={error:string;success:string};
const empty:UserActionState={error:'',success:''};
export async function createAdminUser(_previous:UserActionState,form:FormData):Promise<UserActionState>{
 const {db}=await generalOnly();
 const nombre=String(form.get('nombre')??'').trim().slice(0,120);
 const email=String(form.get('email')??'').trim().toLowerCase();
 const password=String(form.get('password')??'');
 const rol=String(form.get('rol')??'');
 const sedes=selectedSedes(form);
 if(nombre.length<2||!/^\S+@\S+\.\S+$/.test(email)||password.length<12||!['general','sede'].includes(rol))
  return {error:'Completa el nombre, correo y contraseña de al menos 12 caracteres.',success:''};
 if(rol==='sede'&&!sedes.length)return {error:'Selecciona al menos una sede para el administrador de sede.',success:''};
 const {data:validSedes,error:sedeError}=await db.from('sedes').select('id').in('id',sedes.length?sedes:[-1]);
 if(sedeError||(rol==='sede'&&(validSedes??[]).length!==sedes.length))return {error:'Una de las sedes seleccionadas no existe.',success:''};
 const {data:created,error:authError}=await db.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{nombre}});
 if(authError||!created.user)return {error:authError?.message||'No se pudo crear el usuario.',success:''};
 const id=created.user.id;
 const {error:profileError}=await db.from('perfiles_admin').insert({id,nombre,rol,activo:true});
 if(profileError){
  // Si falla el perfil, limpiar la cuenta recién creada para evitar un acceso sin configurar.
  await db.auth.admin.deleteUser(id);
  return {error:'No se pudo registrar el perfil: '+profileError.message,success:''};
 }
 if(rol==='sede'){
  const {error}=await db.from('admin_sedes').insert(sedes.map(sede_id=>({admin_id:id,sede_id})));
  if(error){
   await db.from('perfiles_admin').delete().eq('id',id);
   await db.auth.admin.deleteUser(id);
   return {error:'No se pudieron asignar las sedes: '+error.message,success:''};
  }
 }
 revalidatePath('/admin/usuarios');
 return {error:'',success:'Usuario creado correctamente. Ya puede iniciar sesión con su correo y contraseña temporal.'};
}

export async function updateAdminUser(_previous:UserActionState,form:FormData):Promise<UserActionState>{
 const {admin,db}=await generalOnly();
 const id=String(form.get('id')??'');
 const nombre=String(form.get('nombre')??'').trim().slice(0,120);
 const rol=String(form.get('rol')??'');
 const activo=form.get('activo')==='on';
 const sedes=selectedSedes(form);
 if(!/^[0-9a-f-]{36}$/i.test(id)||nombre.length<2||!['general','sede'].includes(rol))
  return {error:'Revisa el nombre y el rol.',success:''};
 if(id===admin.id&&(rol!=='general'||!activo))return {error:'No puedes quitarte tu propio acceso de administrador general.',success:''};
 if(rol==='sede'&&!sedes.length)return {error:'Asigna al menos una sede.',success:''};
 const {data:validSedes,error:sedeError}=await db.from('sedes').select('id').in('id',sedes.length?sedes:[-1]);
 if(sedeError||(rol==='sede'&&(validSedes??[]).length!==sedes.length))return {error:'Verifica las sedes seleccionadas.',success:''};
 const {error:profileError}=await db.from('perfiles_admin').update({nombre,rol,activo,actualizado_en:new Date().toISOString()}).eq('id',id);
 if(profileError)return {error:'No se pudo actualizar el usuario: '+profileError.message,success:''};
 const {error:removeError}=await db.from('admin_sedes').delete().eq('admin_id',id);
 if(removeError)return {error:'Se guardó el perfil, pero falló la actualización de sedes.',success:''};
 if(rol==='sede'){
  const {error}=await db.from('admin_sedes').insert(sedes.map(sede_id=>({admin_id:id,sede_id})));
  if(error)return {error:'Se guardó el perfil, pero no se pudieron asignar las sedes: '+error.message,success:''};
 }
 revalidatePath('/admin/usuarios');
 return {error:'',success:'Permisos y datos actualizados.'};
}
