'use client';
import {useState,type ReactNode} from 'react';
import {ArrowUpRight,CalendarDays,Minus,Plus,X} from 'lucide-react';
import type {PublicReservationConfig} from '@/lib/public-reservations';
function guatemalaToday(){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Guatemala',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const value=(type:string)=>parts.find(part=>part.type===type)?.value??'';
 return `${value('year')}-${value('month')}-${value('day')}`;
}
function followingDay(iso:string){return new Date(Date.parse(`${iso}T12:00:00Z`)+86400000).toISOString().slice(0,10);}
function openWhatsApp(number:string,message:string){
 const target=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;
 const opened=window.open(target,'_blank');
 if(!opened)window.location.assign(target);
}

import '@/styles/reservation-action.css';
import {ExternalBookingDialog} from './external-booking-dialog';

export function ReservationAction({config,hotel,venueName,roomName,className='',children,initialDate='',initialEndDate='',initialGuests=2,requireDates: _requireDates=false}:{config:PublicReservationConfig|null;hotel:boolean;venueName:string;roomName?:string;roomId?:number;className?:string;children:ReactNode;initialDate?:string;initialEndDate?:string;initialGuests?:number;requireDates?:boolean}){
 const [open,setOpen]=useState(false);
 const [name,setName]=useState('');const [date,setDate]=useState('');const [endDate,setEndDate]=useState('');
 const [guests,setGuests]=useState(initialGuests);const [phone,setPhone]=useState('');const [note,setNote]=useState('');
 const link=config?.url_externa;
 const validExternal=(value:string|undefined|null)=>{if(!value)return false;try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
 if(config?.metodo==='externo'){
  return validExternal(link)?<ExternalBookingDialog url={link!} venueName={venueName} className={className} initialDate={initialDate} initialEndDate={initialEndDate} initialGuests={initialGuests}>{children}</ExternalBookingDialog>:<span className="reservation-unavailable">Reservaciones próximamente</span>;
 }
 const number=(config?.whatsapp_numero||'').replace(/\D/g,'');
 if(config?.metodo!=='whatsapp'||number.length<8)return <span className="reservation-unavailable">Reservaciones próximamente</span>;
 const submit=(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  if(!name.trim()||!date||date<guatemalaToday()||(hotel&&(!endDate||endDate<=date)))return;
  const lines=[`Hola, quisiera consultar una reserva en ${venueName}.`,roomName?`Habitación: ${roomName}`:null,`Nombre: ${name.trim()}`,hotel?`Llegada: ${date}`:`Fecha solicitada: ${date}`,hotel?`Salida: ${endDate}`:null,`Personas: ${guests}`,phone?`Teléfono: ${phone}`:null,note?`Comentarios: ${note}`:null].filter(Boolean);
  openWhatsApp(number,lines.join('\n'));
  setOpen(false);
  setName('');setDate('');setEndDate('');setGuests(2);setPhone('');setNote('');
 };
 const today=guatemalaToday();
 return <>
  <button type="button" className={className} onClick={()=>{const start=initialDate>=today?initialDate:today;setDate(start);setEndDate(initialEndDate>start?initialEndDate:followingDay(start));setGuests(Math.max(1,initialGuests));setOpen(true);}}>{children}</button>
  {open&&<div className="reservation-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}><div className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
   <div className="reservation-modal-heading"><div><span>LOS FAROLES · CONSULTA</span><h2 id="reservation-title">Solicitar {hotel?'una habitación':'información'}</h2><p>{venueName}{roomName?` · ${roomName}`:''}</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar formulario"><X size={22}/></button></div>
   <form onSubmit={submit} className="reservation-modal-form">
    <label>Nombre completo<input value={name} onChange={e=>setName(e.target.value)} maxLength={120} required placeholder="Tu nombre" autoFocus/></label>
    <div className="reservation-modal-dates"><label>{hotel?'Fecha de llegada':'Fecha deseada'}<input type="date" value={date} min={today} onChange={e=>{setDate(e.target.value);if(endDate&&endDate<=e.target.value)setEndDate('');}} required/></label>{hotel&&<label>Fecha de salida<input type="date" value={endDate} min={date||today} onChange={e=>setEndDate(e.target.value)} required/></label>}</div>
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
