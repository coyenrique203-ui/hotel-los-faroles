import Link from 'next/link';
import {redirect} from 'next/navigation';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {getPlatillos} from '@/lib/restaurante';
import {savePlatillo,deletePlatillo} from './actions';
import '@/styles/restaurante.css';

export default async function RestauranteAdmin({searchParams}:{searchParams:Promise<{sede?:string;status?:string}>}){
 const admin=await requireAdmin();
 const {sede:raw,status}=await searchParams;
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='restaurante');
 const sede=sedes.find(s=>s.id===Number(raw))??sedes[0];
 const platos=sede?await getPlatillos(sede.id):[];
 const categories=[...new Set(platos.map(p=>p.categoria))];
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}><div className="admin-page-head"><span>INICIO / RESTAURANTE</span><h1>La carta del restaurante</h1><p>Administra platillos y bebidas de cada restaurante Los Faroles. Los elementos nuevos quedan ocultos hasta que decidas publicarlos.</p></div>
 {status==='ok'&&<p className="restaurant-notice success">Se guardó el platillo correctamente.</p>}
 {status==='deleted'&&<p className="restaurant-notice success">Se eliminó el platillo.</p>}
 {status==='error'&&<p className="restaurant-notice error">No se pudo guardar. Verifica que ejecutaste el SQL 04 y los permisos de esta sede.</p>}
 {status==='invalid'&&<p className="restaurant-notice error">Revisa nombre, categoría, precio e imagen HTTPS.</p>}
 {status==='denegado'&&<p className="restaurant-notice error">No tienes autorización para modificar este restaurante.</p>}
 {!sede?<div className="admin-card restaurant-empty"><h2>Sin restaurantes asignados</h2><p>Crea un establecimiento de tipo Restaurante desde Sedes, o pide que te asignen uno.</p><Link href="/admin/sedes">Administrar sedes →</Link></div>:<>
 <div className="restaurant-switcher">{sedes.map(s=><Link key={s.id} className={s.id===sede.id?'selected':''} href={'/admin/restaurante?sede='+s.id}>{s.nombre} <small>{s.publicado?'Publicado':'Borrador'}</small></Link>)}</div>
 <section className="admin-card restaurant-admin-panel"><div className="admin-card-head"><h2>Agregar a la carta</h2><p>La fotografía es opcional; puedes utilizar una URL pública de Cloudflare R2.</p></div>
 <form action={savePlatillo} className="restaurant-form"><input type="hidden" name="sede_id" value={sede.id}/><div className="restaurant-fields">
 <label>Nombre del platillo<input name="nombre" required minLength={2} maxLength={150} placeholder="Ej. Desayuno chapín"/></label>
 <label>Categoría<input name="categoria" required maxLength={80} list="restaurant-categories" placeholder="Ej. Desayunos"/><datalist id="restaurant-categories">{['Desayunos','Entradas','Platos fuertes','Postres','Bebidas',...categories].map((x,i)=><option key={i} value={x}/>)}</datalist></label>
 <label>Precio (Q, opcional)<input name="precio" type="number" min="0" step="0.01" placeholder="85.00"/></label>
 <label>Orden<input name="orden" type="number" defaultValue="0" step="1"/></label>
 </div><label>Descripción<textarea name="descripcion" maxLength={500} rows={3} placeholder="Ingredientes, acompañamientos o detalles..."/></label><label>URL pública de imagen (opcional)<input name="imagen_url" type="url" placeholder="https://..."/></label>
 <label className="restaurant-check"><input name="publicado" type="checkbox"/> Mostrar en la carta pública</label><button type="submit" className="restaurant-save">Guardar platillo</button></form></section>
 <section className="admin-card restaurant-admin-panel"><div className="admin-card-head"><h2>Platillos registrados</h2><p>{platos.length} elemento{platos.length===1?'':'s'} · Edita cada uno sin salir de esta página.</p></div>
 {platos.length?<div className="restaurant-admin-list">{platos.map(p=><details key={p.id} className="restaurant-editor"><summary><span className="restaurant-editor-name">{p.nombre}<small>{p.categoria} {p.precio===null?'· Precio por consultar':'· Q'+Number(p.precio).toFixed(2)}</small></span><span className={p.publicado?'restaurant-status live':'restaurant-status'}>{p.publicado?'Visible':'Oculto'}</span><span className="restaurant-edit-hint">Editar</span></summary><form action={savePlatillo} className="restaurant-form"><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="id" value={p.id}/><div className="restaurant-fields">
 <label>Nombre<input name="nombre" required defaultValue={p.nombre} maxLength={150}/></label><label>Categoría<input name="categoria" required defaultValue={p.categoria} maxLength={80}/></label>
 <label>Precio (Q)<input type="number" name="precio" min="0" step="0.01" defaultValue={p.precio??''}/></label><label>Orden<input type="number" name="orden" step="1" defaultValue={p.orden}/></label></div>
 <label>Descripción<textarea name="descripcion" rows={3} maxLength={500} defaultValue={p.descripcion??''}/></label><label>URL pública de imagen<input type="url" name="imagen_url" defaultValue={p.imagen_url??''}/></label><label className="restaurant-check"><input type="checkbox" name="publicado" defaultChecked={p.publicado}/> Visible para clientes</label><button type="submit" className="restaurant-save">Guardar cambios</button></form>
 <form action={deletePlatillo} className="restaurant-delete"><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="id" value={p.id}/><button type="submit">Eliminar platillo</button></form></details>)}</div>:<p className="restaurant-empty-message">Todavía no hay platillos registrados. Agrega el primero arriba.</p>}
 </section></>}</AdminShell>;
}
