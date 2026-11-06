import {ArrowUpRight} from 'lucide-react';
import {photos} from '@/lib/hotel-content';
import {Photo} from '../photo';
import type {PublicVenue} from '@/lib/public-content';
import type {HomeCover} from '@/lib/portada-principal';
import {HomeVideo} from './home-video';
import {HomeSlides} from './home-slides';

export function HomeHero({coban,cover}:{coban:PublicVenue;cover:HomeCover}){
 const useImage=cover.modo==='imagen'&&Boolean(cover.imagen_url);
 const useSlides=cover.modo==='carrusel'&&cover.carrusel.length>0;
 const useVideo=!useImage&&!useSlides;
 return <section className="hero" id="inicio">
  <Photo src={coban.imagenesOficiales?coban.hero:photos.hero} alt={coban.imagenesOficiales?'Hotel Los Faroles Cobán':'Fotografía de referencia'} className="hero-photo"/>
  {useVideo&&<HomeVideo src={cover.video_url||'/videos/portada-los-faroles.mp4'}/>}
  {useImage&&<div className="hero-background-image" style={{backgroundImage:`url("${cover.imagen_url}")`}} role="img" aria-label="Portada principal de Los Faroles"/>}
  {useSlides&&<HomeSlides slides={cover.carrusel}/>}
  <div className="hero-overlay"/>
  <div className="hero-copy"><p className="eyebrow gold">LOS FAROLES <span aria-hidden="true">✦</span> COBÁN & ANTIGUA GUATEMALA</p><h1>El arte de <em>sentirse bien.</em></h1><div className="hero-rule" aria-hidden="true"/><p className="hero-subtitle">Dos destinos, una misma esencia. Descubre lugares para detener el tiempo y disfrutar cada momento.</p><a className="hero-link" href="#destinos">DESCUBRE NUESTROS DESTINOS <ArrowUpRight size={18}/></a></div>
  {!coban.imagenesOficiales&&!useImage&&!useSlides&&<small className="hero-credit">Fotografía de referencia</small>}
 </section>;
}
