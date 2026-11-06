'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,ChevronDown,Minus,Plus} from 'lucide-react';
import {DemoAction} from './demo-action';
import {ReservationAction} from './reservation-action';
import type {PublicReservationConfig} from '@/lib/public-reservations';
export function BookingSearch({initialDestination='Cobán, Alta Verapaz',config,venueName='Hotel Los Faroles',destinations}:{initialDestination?:string;config?:PublicReservationConfig|null;venueName?:string;destinations?:{label:string;name:string;config:PublicReservationConfig|null}[]}){
  const [destination,setDestination]=useState(initialDestination),[guests,setGuests]=useState(2);
  const [arrival,setArrival]=useState(''),[departure,setDeparture]=useState('');
  const [loadedDestinations,setLoadedDestinations]=useState<typeof destinations>();
  useEffect(()=>{
   if(destinations||config!==undefined)return;
   const controller=new AbortController();
   fetch('/api/reservas-destinos',{signal:controller.signal}).then(r=>r.ok?r.json():[])
    .then(data=>{if(Array.isArray(data))setLoadedDestinations(data);}).catch(()=>{});
   return ()=>controller.abort();
  },[destinations,config]);
  const available=destinations??loadedDestinations;
  const selected=available?.find(item=>item.label===destination);
  const activeConfig=selected?.config??config;
  const activeName=selected?.name??venueName;
  const dateParts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Guatemala',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const dateValue=(type:string)=>dateParts.find(part=>part.type===type)?.value??'';
  const today=`${dateValue('year')}-${dateValue('month')}-${dateValue('day')}`;
  return <section className="booking" id="reservar"><div className="booking-label"><span>TU PRÓXIMA ESCAPADA</span><strong>Encuentra tu lugar.</strong></div>
    <label>DESTINO <div className="select"><select value={destination} onChange={e=>setDestination(e.target.value)} disabled={!available&&Boolean(config)}>{available?available.map(item=><option key={item.label}>{item.label}</option>):config?<option>{initialDestination}</option>:<><option>Cobán, Alta Verapaz</option><option>Antigua Guatemala</option></>}</select><ChevronDown size={16}/></div></label>
    <label>LLEGADA <input aria-label="Fecha de llegada" type="date" min={today} value={arrival} onChange={e=>{setArrival(e.target.value);if(departure&&departure<=e.target.value)setDeparture('');}}/></label><label>SALIDA <input aria-label="Fecha de salida" type="date" min={arrival||today} value={departure} onChange={e=>setDeparture(e.target.value)}/></label>
    <label>HUÉSPEDES <div className="guests"><button aria-label="Disminuir huéspedes" onClick={()=>setGuests(Math.max(1,guests-1))}><Minus size={13}/></button>{guests} {guests===1?'huésped':'huéspedes'}<button aria-label="Aumentar huéspedes" onClick={()=>setGuests(Math.min(12,guests+1))}><Plus size={13}/></button></div></label>
    {activeConfig?<ReservationAction config={activeConfig} hotel venueName={activeName} className="booking-submit" initialDate={arrival} initialEndDate={departure} initialGuests={guests} requireDates={activeConfig.metodo==='externo'}>CONSULTAR <ArrowRight size={18}/></ReservationAction>:<DemoAction className="booking-submit">CONSULTAR <ArrowRight size={18}/></DemoAction>}
  </section>
}
