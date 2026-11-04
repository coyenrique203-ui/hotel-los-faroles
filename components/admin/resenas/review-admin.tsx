import Link from 'next/link';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {createClient} from '@/lib/supabase/server';
import type {AdminProfile} from '@/lib/auth/require-admin';
import {ReviewInviteForm} from './review-invite-form';
import {moderateReview} from '@/app/admin/resenas/actions';

export async function ReviewAdmin({admin,sedeId}:{admin:AdminProfile;sedeId?:number}){
 const sedes=await getSedesForAdmin(admin);
 const sede=sedes.find(s=>s.id===sedeId)??sedes[0];
 const db=await createClient();
 const [{data:reviews,error},{data:invites}]=sede?await Promise.all([
  db.from('resenas_huespedes').select('id,nombre,puntuacion,comentario,estado,creado_en').eq('sede_id',sede.id).order('creado_en',{ascending:false}).limit(100),
  db.from('invitaciones_resena').select('id,nombre_huesped,fecha_salida,expira_en,usado_en').eq('sede_id',sede.id).order('creado_en',{ascending:false}).limit(25),
 ]):[{data:[],error:null},{data:[]}];
 return <><div className="admin-page-head"><span>INICIO / RESEÑAS</span><h1>Opiniones verificadas</h1><p>Genera invitaciones después de la estancia y modera las opiniones de tus huéspedes.</p></div>
 <div className="admin-card"><div className="admin-card-head"><h2>Establecimiento</h2><p>Selecciona la sede cuyas reseñas administrarás.</p></div><div className="gallery-venue-tabs">{sedes.map(s=><Link key={s.id} className={s.id===sede?.id?'active':''} href={'/admin/resenas?sede='+s.id}>{s.nombre}</Link>)}</div></div>
 {!sede?<div className="admin-card"><div className="gallery-empty">No tienes sedes asignadas.</div></div>:<>
  <section className="admin-card"><div className="admin-card-head"><h2>Invitar a dejar una reseña</h2><p>Solo el personal autorizado puede generar estos enlaces.</p></div><ReviewInviteForm sedeId={sede.id}/></section>
  <section className="admin-card"><div className="admin-card-head"><h2>Reseñas recibidas</h2><p>Las opiniones se publican solo tras una revisión de autenticidad y cumplimiento de reglas, independientemente de su puntuación.</p></div>
   {error?<div className="sede-error">No se pudieron cargar las reseñas. Revisa el SQL y los permisos.</div>:<div className="review-admin-list">{reviews?.length?reviews.map(r=><article key={r.id}><div><strong>{r.nombre}</strong><span>{'★'.repeat(r.puntuacion)}{'☆'.repeat(5-r.puntuacion)}</span><small>{r.estado} · {new Date(r.creado_en).toLocaleDateString('es-GT')}</small></div><p>{r.comentario}</p>{r.estado==='pendiente'&&<form action={moderateReview}><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="resena_id" value={r.id}/><button name="estado" value="publicada" type="submit">Aprobar</button><button name="estado" value="rechazada" type="submit" className="review-reject">Rechazar</button></form>}</article>):<p className="room-empty-copy">Todavía no hay reseñas recibidas.</p>}</div>}
  </section>
  <section className="admin-card"><div className="admin-card-head"><h2>Invitaciones recientes</h2><p>Por seguridad los enlaces originales no se pueden recuperar.</p></div><div className="review-admin-list">{invites?.length?invites.map(i=><article key={i.id}><strong>{i.nombre_huesped}</strong><small>Salida: {i.fecha_salida} · {i.usado_en?'Utilizada':new Date(i.expira_en)<new Date()?'Vencida':'Pendiente'}</small></article>):<p className="room-empty-copy">No se han generado invitaciones.</p>}</div></section>
 </>}</>;
}
