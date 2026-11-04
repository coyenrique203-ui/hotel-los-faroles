import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/auth/require-admin';
import {adminAuthClient} from '@/lib/admin/user-service';
import {NewUserForm,EditUserForm} from './users-form';

type Profile={id:string;nombre:string;rol:'general'|'sede';activo:boolean};
type Assignment={admin_id:string;sede_id:number};
export async function UsersAdmin(){
 const admin=await requireAdmin();
 if(admin.rol!=='general')redirect('/admin');
 const db=adminAuthClient();
 return <><div className="admin-page-head"><span>INICIO / USUARIOS</span><h1>Personal y accesos</h1><p>Crea usuarios, asigna sedes y administra sus permisos.</p></div>
 {!db?<div className="sede-error"><strong>Configuración pendiente.</strong> Agrega SUPABASE_SECRET_KEY en el archivo .env.local y reinicia el servidor. Nunca compartas esta clave ni la publiques en GitHub.</div>:<UsersAdminContent db={db}/>}
 </>;
}

async function UsersAdminContent({db}:{db:NonNullable<ReturnType<typeof adminAuthClient>>}){
 const [profileResult,venuesResult,assignResult,authResult]=await Promise.all([
  db.from('perfiles_admin').select('id,nombre,rol,activo').order('nombre'),
  db.from('sedes').select('id,nombre').order('nombre'),
  db.from('admin_sedes').select('admin_id,sede_id'),
  db.auth.admin.listUsers({page:1,perPage:1000}),
 ]);
 if(profileResult.error||venuesResult.error||assignResult.error||authResult.error)return <div className="sede-error">No se pudieron cargar los usuarios. Revisa la clave privada y los permisos del proyecto.</div>;
 const profiles=(profileResult.data??[]) as Profile[];
 const sedes=(venuesResult.data??[]) as {id:number;nombre:string}[];
 const assignments=(assignResult.data??[]) as Assignment[];
 const emails=new Map((authResult.data?.users??[]).map(u=>[u.id,u.email??'']));
 const users=profiles.map(p=>({...p,email:emails.get(p.id)??'',sedes:assignments.filter(a=>a.admin_id===p.id).map(a=>a.sede_id)}));
 return <>
  <details className="admin-card users-new-card"><summary>+ CREAR NUEVO USUARIO</summary><div className="admin-card-head"><h2>Nuevo miembro del equipo</h2><p>Solo los administradores generales pueden gestionar cuentas.</p></div><NewUserForm sedes={sedes}/></details>
  <section className="admin-card"><div className="admin-card-head"><h2>Usuarios registrados</h2><p>{users.length} cuentas administrativas · Selecciona una para modificar sus permisos.</p></div>
  <div className="users-list">{users.map(u=><details key={u.id} className="users-person"><summary><span className="users-avatar">{u.nombre.slice(0,1).toUpperCase()}</span><span className="users-identity"><strong>{u.nombre}</strong><small>{u.email||u.id}</small></span><span className={u.activo?'users-status-active':'users-status-disabled'}>{u.activo?'Activo':'Desactivado'}</span><span className="users-role">{u.rol==='general'?'General':'Sede'}</span></summary><div className="users-person-editor"><EditUserForm user={u} sedes={sedes}/></div></details>)}</div>
  </section>
 </>;
}
