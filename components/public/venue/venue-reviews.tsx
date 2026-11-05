import {ArrowUpRight,Star,MessageSquareQuote} from 'lucide-react';
import {createPublicClient} from '@/lib/supabase/public';
import type {PublicVenue} from '@/lib/public-content';

type GuestReview={id:number;nombre:string;puntuacion:number;comentario:string;creado_en:string};
export async function VenueReviews({venue}:{venue:PublicVenue}){
 let reviews:GuestReview[]=[];
 if(venue.sedeId){
  try{
   const {data}=await createPublicClient().from('resenas_huespedes')
    .select('id,nombre,puntuacion,comentario,creado_en')
    .eq('sede_id',venue.sedeId).eq('estado','publicada')
    .order('creado_en',{ascending:false}).limit(12);
   reviews=(data??[]) as GuestReview[];
  }catch{/* La web funciona aunque no estén configuradas las tablas de reseñas. */}
 }
 const hasGoogle=Boolean(venue.googleMapsUrl);
 if(!reviews.length&&!hasGoogle)return null;
const average=reviews.length?(reviews.reduce((sum,r)=>sum+r.puntuacion,0)/reviews.length).toFixed(1):null;
 return <section className="venue-reviews wrap" id="resenas" aria-labelledby="venue-reviews-title">
  <div className="venue-reviews-heading"><div><span className="eyebrow">EXPERIENCIAS DE NUESTROS VISITANTES</span><h2 id="venue-reviews-title">Cada visita tiene <em>una historia.</em></h2></div><div className="venue-reviews-heading-aside"><MessageSquareQuote size={24}/><p>Opiniones de personas que recibieron un enlace de invitación después de su visita.</p></div></div>
  {reviews.length>0&&<><div className="venue-verified-summary"><Star fill="currentColor" size={23}/><strong>{average}</strong><span>de 5 · {reviews.length} {reviews.length===1?'reseña verificada publicada':'reseñas verificadas publicadas'}</span></div><div className="venue-reviews-grid">{reviews.map(r=><article key={r.id} className="venue-review-card"><div className="venue-review-card-top"><span className="venue-review-mark">“</span><span className="venue-review-number">{new Date(r.creado_en).toLocaleDateString('es-GT',{year:'numeric',month:'short'})}</span></div><h3>{r.nombre}</h3><p>{r.comentario}</p><div className="venue-review-footer"><span><Star size={14} fill="currentColor"/> {'★'.repeat(r.puntuacion)}{'☆'.repeat(5-r.puntuacion)}</span><small>Invitación verificada por el personal</small></div></article>)}</div></>}
  {hasGoogle&&<div className="venue-google-reviews"><div><span className="eyebrow">GOOGLE MAPS</span><h3>Consulta también nuestras opiniones en Google.</h3><p>Lee las opiniones publicadas directamente en la ficha de este establecimiento.</p></div><a href={venue.googleMapsUrl} target="_blank" rel="noopener noreferrer">VER EN GOOGLE MAPS <ArrowUpRight size={18}/></a></div>}
  <div className="venue-reviews-bottom"><p>Las reseñas del sitio provienen de invitaciones emitidas por el personal. No son reseñas de Google.</p></div>
 </section>;
}
