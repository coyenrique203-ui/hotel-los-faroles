'use server';
import {createHash} from 'node:crypto';
import {createPublicClient} from '@/lib/supabase/public';

export type ReviewSubmitState={ok:boolean;error:string};
export async function submitGuestReview(_previous:ReviewSubmitState,form:FormData):Promise<ReviewSubmitState>{
 const token=String(form.get('token')??'');
 const rating=Number(form.get('puntuacion'));
 const comentario=String(form.get('comentario')??'').trim();
 if(!/^[a-f0-9]{64}$/.test(token)||!Number.isInteger(rating)||rating<1||rating>5||comentario.length<15||comentario.length>1200)
  return {ok:false,error:'Revisa las estrellas y escribe un comentario de 15 a 1200 caracteres.'};
 try{
  const hash=createHash('sha256').update(token).digest('hex');
  const {data,error}=await createPublicClient().rpc('enviar_resena_verificada',{p_hash:hash,p_puntuacion:rating,p_comentario:comentario});
  if(error||data!==true)return {ok:false,error:'El enlace ya fue utilizado, venció o no está disponible.'};
  return {ok:true,error:''};
 }catch{return {ok:false,error:'No se pudo enviar la opinión. Inténtalo nuevamente.'};}
}
