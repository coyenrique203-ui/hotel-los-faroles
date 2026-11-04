'use client';
import {useActionState,useState} from 'react';
import {submitGuestReview} from '@/app/resena/actions';
import {Star} from 'lucide-react';

export function GuestReviewForm({token,nombre,hotel}:{token:string;nombre:string;hotel:string}){
 const [rating,setRating]=useState(0);
 const [state,action,pending]=useActionState(submitGuestReview,{ok:false,error:''});
 if(state.ok)return <div className="guest-review-result"><Star size={35}/><h1>¡Gracias por compartir tu experiencia!</h1><p>Tu reseña fue recibida y será revisada antes de publicarse.</p></div>;
 return <form action={action} className="guest-review-form"><input type="hidden" name="token" value={token}/><input type="hidden" name="puntuacion" value={rating}/>
  <span className="eyebrow">LOS FAROLES · RESEÑA VERIFICADA</span><h1>Tu experiencia importa.</h1><p>Hola, {nombre}. Gracias por visitar {hotel}. Nos encantaría conocer tu opinión sincera, sea positiva o negativa.</p>
  <fieldset><legend>¿Cómo calificarías tu experiencia?</legend><div className="guest-review-stars">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setRating(n)} aria-label={n+' estrellas'} aria-pressed={rating===n}><Star size={35} fill={n<=rating?'currentColor':'none'}/></button>)}</div></fieldset>
  <label>Cuéntanos tu experiencia<textarea name="comentario" required minLength={15} maxLength={1200} rows={6} placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"/></label>
  <p className="guest-review-disclosure">Publicaremos tu nombre y tu comentario si cumplen las reglas de convivencia. Tu opinión no será modificada. No incluyas datos personales sensibles de otras personas.</p>
  {state.error&&<p className="sede-error" role="alert">{state.error}</p>}
  <button type="submit" disabled={pending||rating===0}>{pending?'Enviando...':'Enviar mi reseña'}</button>
 </form>;
}
