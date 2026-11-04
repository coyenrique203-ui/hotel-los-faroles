import Link from 'next/link';
import {ArrowUpRight,MapPin} from 'lucide-react';
import {roomSamples} from '@/lib/hotel-content';
import {Photo} from '../photo';
import {ReservationAction} from '../reservation-action';
import {getPublicReservationConfig} from '@/lib/public-reservations';
import type {PublicVenue} from '@/lib/public-content';
import {RoomGalleryStrip} from './room-gallery-strip';
import {VenueReviews} from './venue-reviews';
import {RoomCard} from './room-card';
import {withRoomAmenities} from '@/lib/public-room-amenities';
import {RestaurantMenu} from './restaurant-menu';
import {RestaurantWhatsApp} from './restaurant-whatsapp';

export async function VenuePage({venue}:{venue:PublicVenue}){
  const config=await getPublicReservationConfig(venue.slug);
  const rooms=await withRoomAmenities(venue.rooms);
  const hotel=venue.type==='hotel';
  const restaurant=venue.type==='restaurant';
  const action=hotel?'SOLICITAR RESERVA':restaurant?'CONSULTAR MESA':'SOLICITAR INFORMACIÓN';
  const restaurantNumber=venue.whatsapp||config?.whatsapp_numero;
  return <main className="venue-page">
    <section className="venue-hero"><Photo src={venue.hero} alt={(venue.heroOficial?'Imagen principal de ':'Fotografía ilustrativa de ')+venue.name}/><div className="venue-hero-shade"/><div className="venue-hero-content"><span className="eyebrow gold">LOS FAROLES · {venue.location.toUpperCase()}</span><h1>{venue.name}</h1><p>{venue.tagline}</p><a href="#descubrir" className="hero-link">DESCUBRE ESTE ESPACIO <ArrowUpRight size={18}/></a></div>{!venue.heroOficial&&<div className="venue-credit">Fotografía de inspiración · contenido de muestra</div>}</section>
    <section className="venue-intro wrap" id="descubrir"><div><span className="eyebrow">BIENVENIDO A {venue.name.toUpperCase()}</span><h2>{venue.tagline}</h2></div><div><p>{venue.introduction}</p><div className="venue-location"><MapPin size={17}/>{venue.location}</div>{venue.oficial&&<div className="venue-contact-links">
      {venue.telefono&&<a href={`tel:${venue.telefono.replace(/[^+\d]/g,'')}`}>Tel. {venue.telefono}</a>}
      {Boolean(venue.telefonosAdicionales?.length)&&<details className="venue-other-phones"><summary>Otros teléfonos ({venue.telefonosAdicionales?.length})</summary><div className="venue-other-phones-list">{venue.telefonosAdicionales?.map((numero,index)=><a key={`${numero}-${index}`} href={`tel:${numero.replace(/[^+\d]/g,'')}`}>{numero}</a>)}</div></details>}
      {venue.whatsapp&&<a href={`https://wa.me/${venue.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={14}/></a>}
      {venue.email&&<a href={`mailto:${venue.email}`}>{venue.email}</a>}
      {venue.googleMapsUrl&&<a href={venue.googleMapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <ArrowUpRight size={14}/></a>}
     </div>}{restaurant?<RestaurantWhatsApp number={restaurantNumber} venueName={venue.name}>{action} <ArrowUpRight size={17}/></RestaurantWhatsApp>:{restaurant?<RestaurantWhatsApp number={restaurantNumber} venueName={venue.name}>{action} <ArrowUpRight size={17}/></RestaurantWhatsApp>:<ReservationAction config={config} hotel={hotel} venueName={venue.name} className="solid-button">{action} <ArrowUpRight size={17}/></ReservationAction>}}</div></section>
    <section className="venue-gallery wrap"><div className="section-head"><div><span className="eyebrow">UNA MIRADA A LOS FAROLES</span><h2>Descubre el <em>ambiente.</em></h2></div><p>{venue.imagenesOficiales?'Fotografías de nuestros espacios.':'Una primera inspiración visual.'}<br/>{venue.imagenesOficiales?'Explora nuestra galería.':'Pronto incorporaremos la galería oficial.'}</p></div><div className="venue-photo-grid">{venue.gallery.map((src,index)=><Photo key={index} src={src} alt={venue.galleryItems?.[index]?.alt||'Imagen de inspiración '+(index+1)}/>)}</div></section>
    {restaurant&&<RestaurantMenu sedeId={venue.sedeId}/>}
    {hotel?<section className="venue-rooms wrap" id="habitaciones"><div className="section-head"><div><span className="eyebrow">TU PRÓXIMO DESCANSO</span><h2>Nuestras <em>habitaciones.</em></h2></div><p>{rooms?.length?'Descubre nuestras opciones de alojamiento.':'Ejemplos de presentación.'}<br/>{rooms?.length?'Tarifas orientativas, sujetas a confirmación.':'Pronto incorporaremos los tipos y precios reales.'}</p></div><div className="room-cards">{rooms?.length?rooms.map(room=><RoomCard key={room.id} room={room} hotelName={venue.name} config={config} hero={venue.hero}/>):roomSamples.map(room=><article className="room-card" key={room.name}><Photo src={room.image} alt={room.name+' ilustrativa'}/><div><h3>{room.name}</h3><p>{room.description}</p><ReservationAction config={config} hotel={true} venueName={venue.name} roomName={room.name} className="underlined">CONSULTAR DISPONIBILIDAD <ArrowUpRight size={16}/></ReservationAction></div></article>)}</div></section>:<section className="venue-feature wrap"><div className="feature-photo"><Photo src={restaurant?venue.gallery[0]:venue.gallery[1]} alt="Ambiente ilustrativo"/></div><div><span className="eyebrow">{restaurant?'GASTRONOMÍA Y ENCUENTROS':'PRÓXIMAMENTE'}</span><h2>{restaurant?'Una mesa para cada ocasión.':'Celebra tu próxima historia.'}</h2><p>{restaurant?'Descubre nuestras especialidades y consulta una mesa para compartir momentos inolvidables.':'Aquí mostraremos capacidades, montajes, servicios, fotografías y solicitudes para eventos.'}</p>{restaurant?<RestaurantWhatsApp number={restaurantNumber} venueName={venue.name}>{action} <ArrowUpRight size={17}/></RestaurantWhatsApp>:<ReservationAction config={config} hotel={hotel} venueName={venue.name} className="solid-button">{action} <ArrowUpRight size={17}/></ReservationAction>}</div></section>}
    <VenueReviews venue={venue}/>
    <section className="venue-next"><span className="eyebrow gold">SEGUIMOS CREANDO EXPERIENCIAS</span><h2>Tu próxima historia<br/><em>comienza aquí.</em></h2>{restaurant?<RestaurantWhatsApp number={restaurantNumber} venueName={venue.name} className="border-button">{action} <ArrowUpRight size={17}/></RestaurantWhatsApp>:<ReservationAction config={config} hotel={hotel} venueName={venue.name} className="border-button">{action} <ArrowUpRight size={17}/></ReservationAction>}<Link href="/" className="venue-back">VOLVER A LOS FAROLES</Link></section>
  </main>
}
