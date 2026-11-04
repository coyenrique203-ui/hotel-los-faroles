import {ArrowUpRight} from 'lucide-react';
import {photos} from '@/lib/hotel-content';
import {Photo} from '../photo';
import type {PublicVenue} from '@/lib/public-content';
import {HomeVideo} from './home-video';
export function HomeHero({coban,videoUrl}:{coban:PublicVenue;videoUrl:string|null}){return <section className="hero" id="inicio"><Photo src={coban.imagenesOficiales?coban.hero:photos.hero} alt={coban.imagenesOficiales?'Hotel Los Faroles Cobán':'Habitación de lujo, fotografía ilustrativa'} className="hero-photo"/><HomeVideo src={videoUrl||'/videos/portada-los-faroles.mp4'}/><div className="hero-overlay"/>
  <div className="hero-copy"><p className="eyebrow gold">LOS FAROLES <span aria-hidden="true">✦</span> COBÁN & ANTIGUA GUATEMALA</p><h1>El arte de <em>sentirse bien.</em></h1><div className="hero-rule" aria-hidden="true"/><p className="hero-subtitle">Dos destinos, una misma esencia. Descubre lugares para detener el tiempo y disfrutar cada momento.</p><a className="hero-link" href="#destinos">DESCUBRE NUESTROS DESTINOS <ArrowUpRight size={18}/></a></div>
  {!coban.imagenesOficiales&&<small className="hero-credit">Fotografía de referencia</small>}
</section>}
