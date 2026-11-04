import Link from 'next/link';
import {ArrowUpRight,MapPin,Building2,UtensilsCrossed,CalendarDays} from 'lucide-react';
import type {Sede} from '@/lib/admin/sedes';
import {createSedeAction} from '@/app/admin/sedes/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/sedes-dinamicas.css';

const icons={hotel:Building2,restaurante:UtensilsCrossed,eventos:CalendarDays};
export function AdminSedes({sedes,canCreate=false,status}:{sedes:Sede[];canCreate?:boolean;status?:string}){
 return <><div className="admin-page-head"><span>INICIO / SEDES</span><h1>Nuestras sedes</h1><p>Administra los datos de cada establecimiento. Los cambios se guardarán en Supabase.</p></div>
 {status==='error'&&<div className="sede-error" role="alert">No se pudo crear la sede. Comprueba que ejecutaste el SQL 07 y vuelve a intentarlo.</div>}
 {status==='invalid'&&<div className="sede-error" role="alert">Introduce un nombre de al menos 3 caracteres y un tipo válido.</div>}
 {status==='denegado'&&<div className="sede-error" role="alert">Solo un administrador general puede crear establecimientos.</div>}
 {canCreate&&<details className="admin-card new-sede-card"><summary className="new-sede-trigger"><span>+ NUEVO ESTABLECIMIENTO</span><small>Crear hotel, restaurante o salón de eventos</small></summary><form action={createSedeAction} className="new-sede-form"><div className="sede-form-grid"><label className="sede-field"><span>Nombre del establecimiento</span><input name="nombre" required minLength={3} maxLength={150} placeholder="Ej. Hotel Los Faroles 2"/></label><label className="sede-field"><span>Tipo de establecimiento</span><select name="tipo" required defaultValue="hotel"><option value="hotel">Hotel</option><option value="restaurante">Restaurante</option><option value="eventos">Salón de eventos</option></select></label></div><label className="sede-field"><span>Dirección (opcional)</span><input name="direccion" maxLength={500} placeholder="Ej. Cobán, Alta Verapaz"/></label><label className="sede-field"><span>Google Maps (opcional)</span><input name="google_maps_url" type="url" maxLength={2000} placeholder="https://maps.app.goo.gl/..."/></label><p>La sede se creará como <strong>borrador</strong>. Después podrás editar sus datos, subir fotografías y publicarla cuando esté lista.</p><FormSubmitButton pendingText="Creando sede...">Crear establecimiento</FormSubmitButton></form></details>}
 <div className="admin-card"><div className="admin-card-head"><h2>Establecimientos</h2><p>{sedes.length} sede{sedes.length===1?' disponible':'s disponibles'} para tu usuario</p></div>
 {sedes.length?<div className="sedes-grid">{sedes.map(s=>{const Icon=icons[s.tipo]??Building2;return <Link href={`/admin/sedes/${s.id}`} className="sede-tile" key={s.id}><div className="sede-tile-icon"><Icon size={24}/></div><div className="sede-tile-body"><span className="sede-tile-type">{s.tipo==='hotel'?'HOTEL':s.tipo==='restaurante'?'GASTRONOMÍA':'EVENTOS'}</span><h3>{s.nombre}</h3><p><MapPin size={14}/>{s.direccion||'Dirección pendiente de completar'}</p><span className={s.publicado?'sede-published':'sede-draft'}>{s.publicado?'Publicado':'Sin publicar'}</span></div><ArrowUpRight className="sede-tile-arrow" size={18}/></Link>})}</div>:<div className="admin-empty sedes-empty">No tienes sedes asignadas o no se encuentran registros. Si eres administrador general, verifica las políticas SQL.</div>}
 </div></>
}
