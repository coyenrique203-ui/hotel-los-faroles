import {ArrowUpRight,ExternalLink,MessageSquareQuote,Star} from 'lucide-react';
import {reviewSamples} from '@/lib/review-samples';
import type {PublicVenue} from '@/lib/public-content';

const COBAN_GOOGLE_REVIEWS_URL='https://maps.app.goo.gl/iSRppYRkLPH1w3XP6';
const COBAN_RATING=4.2;
const COBAN_REVIEW_COUNT=188;

export function VenueReviews({venue}:{venue:PublicVenue}){
 // Prueba identificada solo para la ficha confirmada de Hotel Los Faroles de Cobán.
 // No atribuir estos datos a otras sedes (Faroles 1, Faroles 2, etc.) hasta verificarlas.
 const verifiedCoban=venue.slug==='coban'||venue.name.trim().toLocaleLowerCase('es')==='hotel los faroles de cobán';
 if(verifiedCoban)return <section className="venue-reviews wrap" id="resenas" aria-labelledby="venue-reviews-title">
  <div className="venue-reviews-heading"><div><span className="eyebrow">EXPERIENCIAS DE NUESTROS HUÉSPEDES</span><h2 id="venue-reviews-title">La opinión de quienes <em>nos visitan.</em></h2></div><div className="venue-reviews-heading-aside"><MessageSquareQuote size={24}/><p>Consulta las valoraciones publicadas por nuestros huéspedes en Google.</p></div></div>
  <div className="venue-google-review-panel">
   <div className="venue-google-score">
    <span className="venue-google-label">VALORACIONES EN GOOGLE</span>
    <div className="venue-google-score-line"><strong>{COBAN_RATING.toFixed(1)}</strong><div><div className="venue-google-stars" aria-label="4.2 de 5 estrellas">{Array.from({length:5},(_,i)=><Star key={i} size={21} fill={i<4?'currentColor':'none'}/>)}</div><p>{COBAN_REVIEW_COUNT} opiniones en Google</p></div></div>
    <small>Datos consultados en noviembre de 2026. Las cifras pueden cambiar en Google.</small>
   </div>
   <div className="venue-google-copy"><span className="venue-google-quote">“</span><h3>Experiencias que hablan por sí mismas.</h3><p>Descubre lo que opinan los visitantes de Hotel Los Faroles de Cobán. Las opiniones completas, sus autores y las valoraciones más recientes están disponibles en la ficha original.</p><a href={COBAN_GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">LEER RESEÑAS EN GOOGLE <ArrowUpRight size={17}/></a></div>
  </div>
  <div className="venue-reviews-bottom"><p>Calificación tomada de la ficha pública; esta sección no descarga ni actualiza reseñas automáticamente.</p><a href={COBAN_GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">Ver ficha original <ExternalLink size={14}/></a></div>
 </section>;

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
