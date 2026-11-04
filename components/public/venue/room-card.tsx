'use client';
import {useState} from 'react';
import {ArrowUpRight,Bath,BedDouble,Check,ChevronLeft,ChevronRight,Coffee,CookingPot,Fan,Flame,LockKeyhole,Refrigerator,ShowerHead,Sofa,Sun,Tv,Users,Wifi,Wind,Waves,CarFront,Utensils,BriefcaseBusiness,ThermometerSun} from 'lucide-react';
import type {PublicRoom} from '@/lib/public-content';
import type {PublicReservationConfig} from '@/lib/public-reservations';
import {amenityIcon,amenityLabel} from '@/lib/room-amenities';
import {ReservationAction} from '../reservation-action';
import '@/styles/room-presentation.css';

const icons={wifi:Wifi,tv:Tv,wind:Wind,fan:Fan,bath:Bath,'shower-head':ShowerHead,waves:Waves,'cooking-pot':CookingPot,refrigerator:Refrigerator,coffee:Coffee,sofa:Sofa,sun:Sun,flame:Flame,'lock-keyhole':LockKeyhole,'car-front':CarFront,utensils:Utensils,'briefcase-business':BriefcaseBusiness,'thermometer-sun':ThermometerSun} as const;
function Amenity({value}:{value:string}){const iconName=amenityIcon(value);const Icon=icons[iconName as keyof typeof icons]??Check;return <span className="room-amenity"><Icon size={17} strokeWidth={1.7}/>{amenityLabel(value)}</span>;}

export function RoomCard({room,hotelName,config,hero}:{room:PublicRoom;hotelName:string;config:PublicReservationConfig|null;hero:string}){
 const [active,setActive]=useState(0);
 const photos=[...(room.imagen&&!room.fotos.some(f=>f.src===room.imagen)?[{src:room.imagen,alt:room.nombre}]:[]),...room.fotos];
 if(!photos.length)photos.push({src:hero,alt:room.nombre});
 const previous=()=>setActive(index=>(index-1+photos.length)%photos.length);
 const next=()=>setActive(index=>(index+1)%photos.length);
 return <article className="room-card room-card-refined">
  <div className="room-card-cover room-gallery-carousel" aria-label={`Fotografías de ${room.nombre}`}>
   <img src={photos[active].src} alt={photos[active].alt} loading="lazy"/>
   {photos.length>1&&<><button className="room-slide-arrow room-slide-prev" type="button" onClick={previous} aria-label={`Fotografía anterior de ${room.nombre}`}><ChevronLeft size={21}/></button><button className="room-slide-arrow room-slide-next" type="button" onClick={next} aria-label={`Fotografía siguiente de ${room.nombre}`}><ChevronRight size={21}/></button><span className="room-slide-count">{active+1} / {photos.length}</span></>}
  </div>
  {photos.length>1&&<div className="room-gallery-thumbnails" aria-label="Seleccionar fotografía">{photos.map((photo,index)=><button key={`${photo.src}-${index}`} type="button" className={active===index?'selected':''} onClick={()=>setActive(index)} aria-label={`Ver fotografía ${index+1} de ${room.nombre}`} aria-pressed={active===index}><img src={photo.src} alt="" loading="lazy"/></button>)}</div>}
  <div className="room-card-refined-body"><h3>{room.nombre}</h3>
   <p className="room-card-summary">{room.descripcionDetallada||room.descripcion||'Un espacio pensado para tu comodidad y descanso.'}</p>
   <div className="room-card-facts"><span><Users size={17}/> Hasta {room.capacidad} personas</span><span><BedDouble size={17}/> {room.camas} {room.camas===1?'cama':'camas'}{room.tipoCama?` · ${room.tipoCama}`:''}</span></div>
   {!!room.comodidades?.length&&<div className="room-card-amenities">{room.comodidades.map(value=><Amenity key={value} value={value}/>)}</div>}
   {room.precioDesde!==null&&<div className="room-card-price"><span>DESDE</span><strong>Q{room.precioDesde.toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><small>por noche · precio orientativo</small></div>}
   <div className="room-card-controls"><ReservationAction config={config} hotel venueName={hotelName} roomName={room.nombre} roomId={room.id} className="room-card-reserve">Consultar disponibilidad <ArrowUpRight size={17}/></ReservationAction></div>
  </div>
 </article>;
}
