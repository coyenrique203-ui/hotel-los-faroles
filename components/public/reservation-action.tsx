'use client';
import {useState,type ReactNode} from 'react';
import {ArrowUpRight,CalendarDays,Minus,Plus,X} from 'lucide-react';
import type {PublicReservationConfig} from '@/lib/public-reservations';
import '@/styles/reservation-action.css';

function externalBookingLink(raw:string|undefined|null,arrival:string,departure:string,guests:number){
 if(!raw)return null;
 try{
  const url=new URL(raw);
  if(url.protocol!=='https:'||url.username||url.password)return null;
  // Cloudbeds Booking Engine Plus admite fechas y huéspedes en la URL pública.
  if(url.hostname==='hotels.cloudbeds.com'&&/^\\/(?:[a-z]{2}\\/)?reservation\\//i.test(url.pathname)){
   if(arrival)url.searchParams.set('checkin',arrival);
   else url.searchParams.delete('checkin');
   if(departure)url.searchParams.set('checkout',departure);
   else url.searchParams.delete('checkout');
   url.searchParams.set('guests',String(guests));
   // Los enlaces de prueba pueden traer filtros anteriores: conservamos solo los actuales.
   url.searchParams.delete('adults');
   url.searchParams.delete('kids');
  }
  // También admitimos enlaces de SimpleBooking para otras sedes.
  if(url.hostname==='simplebooking.it'||url.hostname.endsWith('.simplebooking.it')){
   if(arrival)url.searchParams.set('in',arrival);
   if(departure)url.searchParams.set('out',departure);
   url.searchParams.set('guests',Array.from({length:guests},()=> 'A').join(','));
  }
  return url.toString();
 }catch{return null;}
}

export function ReservationAction({config,hotel,venueName,roomName,roomId,className='',children,initialDate='',initialEndDate='',initialGuests=2,requireDates=false}:{config:PublicReservationConfig|null;hotel:boolean;venueName:string;roomName?:string;roomId?:number;className?:string;children:ReactNode;initialDate?:string;initialEndDate?:string;initialGuests?:number;requireDates?:boolean}){
 const [open,setOpen]=useState(false);
 const [name,setName]=useState('');const [date,setDate]=useState('');const [endDate,setEndDate]=useState('');
 const [guests,setGuests]=useState(initialGuests);const [phone,setPhone]=useState('');const [note,setNote]=useState('');
 const link=roomId?config?.roomLinks[roomId]||config?.url_externa:config?.url_externa;
 const validExternal=(value:string|undefined|null)=>{if(!value)return false;try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
 if(config?.metodo==='externo'){
  if(requireDates&&(!initialDate||!initialEndDate||initialEndDate<=initialDate))return <button className={className} type="button" disabled title="Selecciona fechas válidas de llegada y salida">{children}</button>;
  const target=externalBookingLink(link,initialDate,initialEndDate,initialGuests);
  return validExternal(target)?<a className={className} href={target!} target="_blank" rel="noopener noreferrer">{children}</a>:<span className="reservation-unavailable">Reservaciones próximamente</span>;
 }
 const number=(config?.whatsapp_numero||'').replace(/\D/g,'');
 if(config?.metodo!=='whatsapp'||number.length<8)return <span className="reservation-unavailable">Reservaciones próximamente</span>;
 const submit=(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(hotel&&endDate<=date)return;
  const lines=[`Hola, quisiera consultar una reserva en ${venueName}.`,roomName?`Habitación: ${roomName}`:null,`Nombre: ${name}`,hotel?`Llegada: ${date}`:`Fecha solicitada: ${date}`,hotel?`Salida: ${endDate}`:null,`Personas: ${guests}`,phone?`Teléfono: ${phone}`:null,note?`Comentarios: ${note}`:null].filter(Boolean);
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener,noreferrer');
  setOpen(false);
 };
 const today=new Date().toLocaleDateString('en-CA');
 return <>
  <button type="button" className={className} onClick={()=>{setDate(initialDate);setEndDate(initialEndDate);setGuests(initialGuests);setOpen(true);}}>{children}</button>
  {open&&<div className="reservation-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}><div className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
   <div className="reservation-modal-heading"><div><span>LOS FAROLES · CONSULTA</span><h2 id="reservation-title">Solicitar {hotel?'una habitación':'información'}</h2><p>{venueName}{roomName?` · ${roomName}`:''}</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar formulario"><X size={22}/></button></div>
   <form onSubmit={submit} className="reservation-modal-form">
    <label>Nombre completo<input value={name} onChange={e=>setName(e.target.value)} maxLength={120} required placeholder="Tu nombre" autoFocus/></label>
    <div className="reservation-modal-dates"><label>{hotel?'Fecha de llegada':'Fecha deseada'}<input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} required/></label>{hotel&&<label>Fecha de salida<input type="date" value={endDate} min={date||today} onChange={e=>setEndDate(e.target.value)} required/></label>}</div>
    <label>Cantidad de personas<div className="reservation-guests"><button type="button" onClick={()=>setGuests(Math.max(1,guests-1))} aria-label="Restar persona"><Minus size={16}/></button><span>{guests} {guests===1?'persona':'personas'}</span><button type="button" onClick={()=>setGuests(Math.min(50,guests+1))} aria-label="Agregar persona"><Plus size={16}/></button></div></label>
    <label>Teléfono de contacto (opcional)<input type="tel" value={phone} maxLength={40} onChange={e=>setPhone(e.target.value)} placeholder="+502 ..."/></label>
    <label>Comentario adicional (opcional)<textarea value={note} maxLength={350} rows={2} onChange={e=>setNote(e.target.value)} placeholder="¿Algo que debamos saber?"/></label>
    {hotel&&endDate&&date&&endDate<=date&&<p className="reservation-validation">La salida debe ser posterior a la llegada.</p>}
    <button type="submit" className="reservation-send" disabled={hotel&&!!endDate&&!!date&&endDate<=date}>Continuar por WhatsApp <ArrowUpRight size={17}/></button>
    <p className="reservation-explanation"><CalendarDays size={15}/> Esto abre WhatsApp con tu consulta. La disponibilidad se confirma directamente con el hotel.</p>
   </form>
  </div></div>}
 </>;
}
