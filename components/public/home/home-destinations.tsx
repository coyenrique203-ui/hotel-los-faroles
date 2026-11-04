import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {PublicVenue} from '@/lib/public-content';
import {Photo} from '../photo';
import {getPublishedEstablishments} from '@/lib/public-establishments';
import {photos} from '@/lib/hotel-content';
import '@/styles/sedes-dinamicas.css';
export async function HomeDestinations({venues}:{venues:{coban:PublicVenue;antigua:PublicVenue}}){
  const published=await getPublishedEstablishments();
  const destinations=published.length?published.map(s=>({
    key:s.slug,name:s.nombre,location:s.direccion||'Ubicación por confirmar',
    hero:s.imagen||(s.tipo==='hotel'?photos.coban:s.tipo==='restaurante'?photos.restaurant:photos.events),
    href:`/sedes/${s.slug}`,official:Boolean(s.imagen),
  })):[venues.coban,venues.antigua].map(s=>({key:s.slug,name:s.name,location:s.location,hero:s.hero,href:`/${s.slug}`,official:s.imagenesOficiales}));
  return <>
  <section className="intro wrap" id="esencia"><div className="intro-side"><span className="eyebrow">BIENVENIDO A LOS FAROLES</span><b>✣</b></div><div><h2>Una hospitalidad que<br/>se <em>siente diferente.</em></h2><div className="intro-bottom"><p>Entre calles llenas de historia y paisajes que inspiran, te invitamos a descubrir una forma más cálida de viajar. Cada destino es una nueva historia por vivir.</p><a className="underlined" href="#destinos">CONOCE NUESTROS DESTINOS <ArrowUpRight size={17}/></a></div></div></section>
  <section className="destinations wrap" id="destinos"><div className="section-head"><div><span className="eyebrow">LUGARES QUE INSPIRAN</span><h2>Elige tu <em>destino.</em></h2></div><p>Descubre nuestros establecimientos.<br/>Cada uno con una experiencia propia.</p></div>
    <div className="destination-grid">{destinations.map((venue,index)=><Link className="destination" href={venue.href} key={venue.key}><Photo src={venue.hero} alt={'Fotografía de '+venue.name}/><div className="darken"/><span className="destination-top">{String(index+1).padStart(2,'0')} / LOS FAROLES</span><div className="destination-bottom"><div><small>DESCUBRE EL ESTABLECIMIENTO</small><h3 className="destination-name">{venue.name}</h3><p>{venue.location}</p></div><span className="circle-arrow"><ArrowUpRight/></span></div></Link>)}</div>
    {destinations.some(s=>!s.official)&&<p className="disclaimer">Algunas fotografías son de referencia mientras se prepara el contenido oficial de cada establecimiento.</p>}
  </section>
</>}
