'use client';
import {useActionState} from 'react';
import {createAdminUser,updateAdminUser,type UserActionState} from '@/app/admin/usuarios/actions';

type SedeOption={id:number;nombre:string};
type User={id:string;nombre:string;email:string;rol:'general'|'sede';activo:boolean;sedes:number[]};
const initial:UserActionState={error:'',success:''};

function VenueChecks({sedes,selected=[]}:{sedes:SedeOption[];selected?:number[]}){
 return <fieldset className="users-sedes-list"><legend>Sedes asignadas (para rol de sede)</legend>{sedes.map(s=><label key={s.id}><input type="checkbox" name="sedes" value={s.id} defaultChecked={selected.includes(s.id)}/><span>{s.nombre}</span></label>)}</fieldset>;
}

export function NewUserForm({sedes}:{sedes:SedeOption[]}){
 const [result,action,pending]=useActionState(createAdminUser,initial);
 return <form action={action} className="users-form">
  <div className="sede-form-grid"><label className="sede-field"><span>Nombre completo</span><input name="nombre" minLength={2} maxLength={120} required placeholder="Ej. Ana López"/></label><label className="sede-field"><span>Correo electrónico</span><input type="email" name="email" required placeholder="empleado@faroles.com"/></label></div>
  <div className="sede-form-grid"><label className="sede-field"><span>Contraseña temporal</span><input type="password" name="password" minLength={12} required autoComplete="new-password" placeholder="Al menos 12 caracteres"/></label><label className="sede-field"><span>Rol</span><select name="rol" defaultValue="sede"><option value="sede">Administrador de sede</option><option value="general">Administrador general</option></select></label></div>
  <VenueChecks sedes={sedes}/>
  <p className="users-hint">Las cuentas se crean en Supabase Auth. Comparte la contraseña temporal de forma segura y solicita al usuario que la cambie.</p>
  <button type="submit" disabled={pending}>{pending?'Creando usuario...':'Crear usuario'}</button>
  {result.error&&<p className="sede-error" role="alert">{result.error}</p>}{result.success&&<p className="sede-success" role="status">{result.success}</p>}
 </form>;
}

export function EditUserForm({user,sedes}:{user:User;sedes:SedeOption[]}){
 const [result,action,pending]=useActionState(updateAdminUser,initial);
 return <form action={action} className="users-form users-edit-form"><input type="hidden" name="id" value={user.id}/>
  <div className="sede-form-grid"><label className="sede-field"><span>Nombre</span><input name="nombre" required minLength={2} maxLength={120} defaultValue={user.nombre}/></label><label className="sede-field"><span>Rol</span><select name="rol" defaultValue={user.rol}><option value="sede">Administrador de sede</option><option value="general">Administrador general</option></select></label></div>
  <VenueChecks sedes={sedes} selected={user.sedes}/>
  <label className="sede-publication"><input type="checkbox" name="activo" defaultChecked={user.activo}/><span><strong>Usuario activo</strong><small>Desactívalo para impedir nuevos accesos al panel. No elimina su historial.</small></span></label>
  <button type="submit" disabled={pending}>{pending?'Guardando...':'Guardar permisos'}</button>
  {result.error&&<p className="sede-error" role="alert">{result.error}</p>}{result.success&&<p className="sede-success" role="status">{result.success}</p>}
 </form>;
}
