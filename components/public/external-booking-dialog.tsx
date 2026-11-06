'use client';
import {useState,type FormEvent,type ReactNode} from 'react';
import {ArrowUpRight,CalendarDays,Minus,Plus,X} from 'lucide-react';
import '@/styles/reservation-action.css';

function localDate(offset=0){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Guatemala',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get=(type:string)=>parts.find(part=>part.type===type)?.value??'';
 const date=new Date(Date.UTC(Number(get('year')),Number(get('month'))-1,Number(get('day'))+offset));
 return date.toISOString().slice(0,10);
}
function buildBookingUrl(raw:string,checkin:string,checkout:string,guests:number){
 try{
  const url=new URL(raw);
  if(url.protocol!=='https:'||url.username||url.password)return null;
  if(url.hostname==='hotels.cloudbeds.com'&&url.pathname.split('/').includes('reservation')){
   url.searchParams.set('checkin',checkin);
   url.searchParams.set('checkout',checkout);
   url.searchParams.set('guests',String(guests));
   url.searchParams.delete('accommodation_types');
   url.searchParams.delete('room_type');
   url.searchParams.delete('adults');
   url.searchParams.delete('kids');
  }else if(url.hostname==='simplebooking.it'||url.hostname.endsWith('.simplebooking.it')){
   url.searchParams.set('in',checkin);
   url.searchParams.set('out',checkout);
   url.searchParams.set('guests',Array.from({length:guests},()=> 'A').join(','));
  }
  return url.toString();
 }catch{return null;}
}

export function ExternalBookingDialog({url,venueName,className='',children,initialDate='',initialEndDate='',initialGuests=2}:{url:string;venueName:string;className?:string;children:ReactNode;initialDate?:string;initialEndDate?:string;initialGuests?:number}){
 const [open,setOpen]=useState(false);
 const [arrival,setArrival]=useState('');
 const [departure,setDeparture]=useState('');
 const [guests,setGuests]=useState(Math.max(1,initialGuests));
 const today=localDate();
 const begin=()=>{setArrival(initialDate>=today?initialDate:today);setDeparture(initialEndDate>(initialDate>=today?initialDate:today)?initialEndDate:localDate(1));setGuests(Math.max(1,initialGuests));setOpen(true);};
 const submit=(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(arrival<today||departure<=arrival)return;
  const target=buildBookingUrl(url,arrival,departure,guests);
  if(target)window.location.assign(target);
 };
 return <>
  <button type="button" className={className} onClick={begin}>{children}</button>
  {open&&<div className="reservation-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
   <div className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="external-booking-title">
    <div className="reservation-modal-heading"><div><span>LOS FAROLES · DISPONIBILIDAD</span><h2 id="external-booking-title">Planifica tu estancia</h2><p>{venueName}</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar formulario"><X size={22}/></button></div>
    <form className="reservation-modal-form" onSubmit={submit}>
     <div className="reservation-modal-dates">
      <label>Fecha de llegada<input type="date" required value={arrival} min={today} onChange={event=>{setArrival(event.target.value);if(departure<=event.target.value)setDeparture('');}}/></label>
      <label>Fecha de salida<input type="date" required value={departure} min={arrival||today} onChange={event=>setDeparture(event.target.value)}/></label>
     </div>
     <label>Cantidad de personas<div className="reservation-guests"><button type="button" onClick={()=>setGuests(Math.max(1,guests-1))} aria-label="Restar persona"><Minus size={16}/></button><span>{guests} {guests===1?'persona':'personas'}</span><button type="button" onClick={()=>setGuests(Math.min(20,guests+1))} aria-label="Agregar persona"><Plus size={16}/></button></div></label>
     {arrival&&departure&&departure<=arrival&&<p className="reservation-validation">La fecha de salida debe ser posterior a la llegada.</p>}
     <button className="reservation-send" type="submit" disabled={!arrival||!departure||departure<=arrival}>Consultar disponibilidad <ArrowUpRight size={17}/></button>
     <p className="reservation-explanation"><CalendarDays size={15}/> Te dirigiremos al motor de reservas oficial del hotel con estas fechas y huéspedes. Allí podrás consultar los precios y tipos de habitación disponibles.</p>
    </form>
   </div>
  </div>}
 </>;
}
