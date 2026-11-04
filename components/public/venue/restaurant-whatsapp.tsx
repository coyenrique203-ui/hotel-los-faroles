'use client';
import {useState,type ReactNode} from 'react';
import {ArrowUpRight,X} from 'lucide-react';

export function RestaurantWhatsApp({number,venueName,children,className='solid-button'}:{number?:string|null;venueName:string;children:ReactNode;className?:string}){
 const [open,setOpen]=useState(false),[name,setName]=useState(''),[date,setDate]=useState(''),[time,setTime]=useState(''),[guests,setGuests]=useState(2),[phone,setPhone]=useState(''),[note,setNote]=useState('');
 const digits=(number??'').replace(/\D/g,'');
 const today=new Date().toLocaleDateString('en-CA');
 if(digits.length<8)return <span className="reservation-unavailable">Consultas próximamente</span>;
 const send=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const message=[`Hola, quisiera consultar una mesa en ${venueName}.`,`Nombre: ${name}`,`Fecha: ${date}`,`Hora: ${time}`,`Personas: ${guests}`,phone?`Teléfono: ${phone}`:null,note?`Comentarios: ${note}`:null,'Quedo pendiente de confirmar disponibilidad.'].filter(Boolean).join('\n');
  window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
  setOpen(false);
 };
 return <><button type="button" className={className} onClick={()=>setOpen(true)}>{children}</button>
 {open&&<div className="restaurant-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="restaurant-modal" role="dialog" aria-modal="true" aria-labelledby="restaurant-modal-title">
 <div className="restaurant-modal-head"><div><span>LOS FAROLES · RESTAURANTE</span><h2 id="restaurant-modal-title">Consulta tu mesa</h2><p>La disponibilidad la confirmará nuestro personal.</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar"><X size={20}/></button></div>
 <form onSubmit={send} className="restaurant-modal-form"><label>Nombre completo<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label><div className="restaurant-modal-grid"><label>Fecha<input required type="date" min={today} value={date} onChange={e=>setDate(e.target.value)}/></label><label>Hora<input required type="time" value={time} onChange={e=>setTime(e.target.value)}/></label></div><div className="restaurant-modal-grid"><label>Personas<input required type="number" min="1" max="50" value={guests} onChange={e=>setGuests(Number(e.target.value))}/></label><label>Teléfono (opcional)<input type="tel" maxLength={40} value={phone} onChange={e=>setPhone(e.target.value)}/></label></div><label>Comentarios (opcional)<textarea maxLength={350} rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="¿Una ocasión especial?"/></label><button type="submit" className="restaurant-send">Consultar por WhatsApp <ArrowUpRight size={18}/></button><p className="restaurant-modal-note">Enviar este mensaje no confirma una reserva.</p></form>
 </div></div>}</>;
}
