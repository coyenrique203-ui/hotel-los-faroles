import Link from 'next/link';
import {createClient} from '@/lib/supabase/server';
import type {Sede} from '@/lib/admin/sedes';
import {ReviewInviteForm} from './review-invite-form';
import {moderateReview} from '@/app/admin/resenas/actions';

export async function EstablishmentReviews({sede}:{sede:Sede}){
 const db=await createClient();
 const [{data:reviews,error},{data:invites}]=await Promise.all([
  db.from('resenas_huespedes').select('id,nombre,puntuacion,comentario,estado,creado_en').eq('sede_id',sede.id).order('creado_en',{ascending:false}).limit(100),
  db.from('invitaciones_resena').select('id,nombre_huesped,fecha_salida,expira_en,usado_en').eq('sede_id',sede.id).order('creado_en',{ascending:false}).limit(25)
 ]);
 return <div className="establishment-review-editor"><section className="admin-card"><div className="admin-card-head"><h2>Compartir enlace de reseña</h2><p>El personal puede generar un enlace privado después de confirmar que el cliente visitó {sede.nombre}. Cada enlace permite una reseña y vence a los 15 días.</p></div><ReviewInviteForm sedeId={sede.id} kind={sede.tipo}/></section>
 <section className="admin-card"><div className="admin-card-head"><h2>Reseñas recibidas</h2><p>Se revisan para verificar autenticidad y cumplimiento de reglas, independientemente de su puntuación.</p></div>
 {error?<div className="sede-error">No se pudieron cargar las reseñas. Revisa los permisos de Supabase.</div>:<div className="review-admin-list">{reviews?.length?reviews.map(r=><article key={r.id}><div><strong>{r.nombre}</strong><span>{'★'.repeat(r.puntuacion)}{'☆'.repeat(5-r.puntuacion)}</span><small>{r.estado} · {new Date(r.creado_en).toLocaleDateString('es-GT')}</small></div><p>{r.comentario}</p>{r.estado==='pendiente'&&<form action={moderateReview}><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="resena_id" value={r.id}/><button name="estado" value="publicada" type="submit">Aprobar</button><button name="estado" value="rechazada" type="submit" className="review-reject">Rechazar</button></form>}</article>):<p className="room-empty-copy">Todavía no hay reseñas recibidas.</p>}</div>}</section>
 <section className="admin-card"><div className="admin-card-head"><h2>Invitaciones recientes</h2><p>Por seguridad, los enlaces originales no se pueden recuperar después de generarlos.</p></div><div className="review-admin-list">{invites?.length?invites.map(i=><article key={i.id}><strong>{i.nombre_huesped}</strong><small>Fecha de visita o evento: {i.fecha_salida} · {i.usado_en?'Utilizada':new Date(i.expira_en)<new Date()?'Vencida':'Pendiente'}</small></article>):<p className="room-empty-copy">Todavía no hay invitaciones.</p>}</div></section>
 {sede.google_maps_url&&<div className="admin-card experience-review-google"><h2>Opiniones en Google Maps</h2><p>Los visitantes también pueden consultar las reseñas públicas del establecimiento.</p><Link href={sede.google_maps_url} target="_blank">Ver ficha de Google Maps ↗</Link></div>}
 </div>;
}
