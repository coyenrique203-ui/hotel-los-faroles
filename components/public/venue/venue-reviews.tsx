import {ArrowUpRight,MessageSquareQuote,Star} from 'lucide-react';
import {reviewSamples} from '@/lib/review-samples';
import type {PublicVenue} from '@/lib/public-content';

export function VenueReviews({venue}:{venue:PublicVenue}){
 const samples=reviewSamples[venue.slug as keyof typeof reviewSamples]??[];
 if(!samples.length)return null;
 const upcoming=venue.slug==='eventos';
 return <section className="venue-reviews wrap" id="resenas" aria-labelledby="venue-reviews-title">
  <div className="venue-reviews-heading"><div><span className="eyebrow">VOCES Y EXPERIENCIAS</span><h2 id="venue-reviews-title">Historias que <em>inspiran.</em></h2></div><div className="venue-reviews-heading-aside"><MessageSquareQuote size={24}/><p>{upcoming?'Un espacio reservado para las futuras experiencias de quienes celebren con nosotros.':'Un adelanto de cómo se mostrarán las experiencias de quienes nos visiten.'}</p></div></div>
  <div className="venue-reviews-demo-note"><span>VISTA DE DEMOSTRACIÓN</span> Estos textos son ejemplos de diseño; todavía no son reseñas de clientes ni de Google.</div>
  <div className="venue-reviews-grid">{samples.map((item,index)=><article key={item.title} className="venue-review-card"><div className="venue-review-card-top"><span className="venue-review-mark">“</span><span className="venue-review-number">0{index+1} / 03</span></div><h3>{item.title}</h3><p>{item.comment}</p><div className="venue-review-footer"><span><Star size={14} fill="currentColor"/> CONTENIDO DE EJEMPLO</span><small>{item.context}</small></div></article>)}</div>
  <div className="venue-reviews-bottom"><p>Las reseñas reales se podrán conectar más adelante al perfil de Google de cada establecimiento.</p>{venue.googleMapsUrl&&<a href={venue.googleMapsUrl} rel="noopener noreferrer" target="_blank">Ver ubicación en Google Maps <ArrowUpRight size={15}/></a>}</div>
 </section>;
}
