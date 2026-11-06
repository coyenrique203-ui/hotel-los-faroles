'use client';
import {useState,type ReactNode} from 'react';
import {ArrowUpRight,X} from 'lucide-react';
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

import '@/styles/experiencias.css';

export function ExperienceWhatsApp({type,phone,venueName,children,className='solid-button'}:{type:'restaurant'|'events';phone?:string|null;venueName:string;children:ReactNode;className?:string}){
 const [open,setOpen]=useState(false),[name,setName]=useState(''),[date,setDate]=useState(''),[hour,setHour]=useState(''),[guests,setGuests]=useState(2),[phoneContact,setPhoneContact]=useState(''),[eventType,setEventType]=useState(''),[note,setNote]=useState('');
 const digits=(phone??'').replace(/\D/g,'');
 const restaurant=type==='restaurant';
 const dateToday=guatemalaToday();
 if(digits.length<8)return <span className="reservation-unavailable">Consultas próximamente</span>;
 const submit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(!date||date<guatemalaToday()||!name.trim()||guests<1||guests>(restaurant?100:10000)||(restaurant&&!hour))return;
  const lines=[`Hola, quisiera consultar ${restaurant?'disponibilidad de una mesa':'disponibilidad del salón para un evento'} en ${venueName}.`,`A nombre de: ${name.trim()}`,`Fecha: ${date}`,restaurant?`Hora: ${hour}`:null,`${restaurant?'Personas':'Invitados estimados'}: ${guests}`,!restaurant&&eventType?`Tipo de evento: ${eventType}`:null,phoneContact?`Teléfono: ${phoneContact}`:null,note?`Comentarios: ${note}`:null,'Quedo pendiente de confirmación.'].filter(Boolean);
  openWhatsApp(digits,lines.join('\n'));
  setOpen(false);
 };
 return <><button type="button" className={className} onClick={()=>setOpen(true)}>{children}</button>{open&&
 <div className="experience-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="experience-dialog" role="dialog" aria-modal="true" aria-labelledby="experience-dialog-title">
 <header><div><span>LOS FAROLES · {restaurant?'RESTAURANTE':'EVENTOS'}</span><h2 id="experience-dialog-title">{restaurant?'Consultar una mesa':'Consultar disponibilidad'}</h2><p>{venueName}</p></div><button type="button" aria-label="Cerrar formulario" onClick={()=>setOpen(false)}><X size={22}/></button></header>
 <form onSubmit={submit}><label>Nombre completo<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label>
 <div className="experience-form-grid"><label>Fecha {restaurant?'de visita':'del evento'}<input required type="date" min={dateToday} value={date} onChange={e=>setDate(e.target.value)}/></label>{restaurant?<label>Hora aproximada<input required type="time" value={hour} onChange={e=>setHour(e.target.value)}/></label>:<label>Tipo de evento<input maxLength={100} value={eventType} onChange={e=>setEventType(e.target.value)} placeholder="Boda, cumpleaños, conferencia..."/></label>}</div>
 <div className="experience-form-grid"><label>{restaurant?'Personas':'Cantidad estimada de invitados'}<input required type="number" min="1" max={restaurant?100:10000} value={guests} onChange={e=>setGuests(Number(e.target.value))}/></label><label>Teléfono (opcional)<input type="tel" maxLength={40} value={phoneContact} onChange={e=>setPhoneContact(e.target.value)} placeholder="+502..."/></label></div>
 <label>Comentarios (opcional)<textarea maxLength={600} rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder={restaurant?'¿Alguna ocasión especial?':'Montaje, servicios o detalles que deseas consultar'}/></label>
 <button className="experience-submit" type="submit">Continuar por WhatsApp <ArrowUpRight size={18}/></button><small>La consulta no confirma una reservación. El personal verificará disponibilidad y responderá por WhatsApp.</small>
 </form></div></div>}</>;
}
