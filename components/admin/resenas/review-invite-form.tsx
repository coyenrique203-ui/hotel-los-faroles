'use client';
import {useActionState} from 'react';
import {createReviewInvitation,type InviteResult} from '@/app/admin/resenas/actions';

const initial:InviteResult={url:'',error:''};
export function ReviewInviteForm({sedeId}:{sedeId:number}){
 const [result,action,pending]=useActionState(createReviewInvitation,initial);
 const link=result.url?(typeof window!=='undefined'?window.location.origin:'')+result.url:'';
 return <form action={action} className="review-invite-form">
  <input type="hidden" name="sede_id" value={sedeId}/>
  <div className="sede-form-grid"><label className="sede-field"><span>Nombre del huésped</span><input name="nombre" required minLength={2} maxLength={120} placeholder="Nombre que aparecerá con la reseña"/></label><label className="sede-field"><span>Fecha de salida</span><input name="fecha_salida" type="date" required max={new Date().toISOString().slice(0,10)}/></label></div>
  <p>Genera el enlace únicamente después de verificar en recepción que el huésped se hospedó. Será válido durante 15 días y para una sola reseña.</p>
  <button type="submit" disabled={pending}>{pending?'Generando...':'Generar enlace privado'}</button>
  {result.error&&<p className="sede-error" role="alert">{result.error}</p>}
  {result.url&&<div className="review-generated-link" role="status"><strong>Enlace generado (cópialo ahora; no volverá a mostrarse)</strong><input readOnly aria-label="Enlace de reseña" value={link}/><a target="_blank" rel="noopener noreferrer" href={'https://wa.me/?text='+encodeURIComponent('Gracias por hospedarte con nosotros. Comparte tu experiencia: '+link)}>Compartir por WhatsApp ↗</a></div>}
 </form>;
}
