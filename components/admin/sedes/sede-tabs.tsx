'use client';

import {useState,type ReactNode} from 'react';
import {Images, MapPin, CalendarCheck, PartyPopper} from 'lucide-react';

export function SedeTabs({info,photos,reservas,activities,initialTab='info',photoCount}:{info:ReactNode;photos:ReactNode;reservas?:ReactNode;activities?:ReactNode;initialTab?:'info'|'fotos'|'reservas'|'actividades';photoCount:number}){
 const [active,setActive]=useState<'info'|'fotos'|'reservas'|'actividades'>(initialTab);
 return <div className="sede-tab-layout">
  <div className="sede-tabs" role="tablist" aria-label="Secciones de la sede">
   <button id="sede-tab-info" type="button" role="tab" aria-selected={active==='info'} aria-controls="sede-panel-info" className={active==='info'?'active':''} onClick={()=>setActive('info')}><MapPin size={17}/> Información general</button>
   <button id="sede-tab-fotos" type="button" role="tab" aria-selected={active==='fotos'} aria-controls="sede-panel-fotos" className={active==='fotos'?'active':''} onClick={()=>setActive('fotos')}><Images size={17}/> Fotografías <span className="sede-tab-count">{photoCount}</span></button>
   {reservas&&<button id="sede-tab-reservas" type="button" role="tab" aria-selected={active==='reservas'} aria-controls="sede-panel-reservas" className={active==='reservas'?'active':''} onClick={()=>setActive('reservas')}><CalendarCheck size={17}/> Reservaciones</button>}
   {activities&&<button id="sede-tab-actividades" type="button" role="tab" aria-selected={active==='actividades'} aria-controls="sede-panel-actividades" className={active==='actividades'?'active':''} onClick={()=>setActive('actividades')}><PartyPopper size={17}/> Actividades realizadas</button>}
  </div>
  <div id="sede-panel-info" role="tabpanel" aria-labelledby="sede-tab-info" className="sede-tab-panel" hidden={active!=='info'}>{info}</div>
  <div id="sede-panel-fotos" role="tabpanel" aria-labelledby="sede-tab-fotos" className="sede-tab-panel" hidden={active!=='fotos'}>{photos}</div>
  {activities&&<div id="sede-panel-actividades" role="tabpanel" aria-labelledby="sede-tab-actividades" className="sede-tab-panel" hidden={active!=='actividades'}>{activities}</div>}
  {reservas&&<div id="sede-panel-reservas" role="tabpanel" aria-labelledby="sede-tab-reservas" className="sede-tab-panel" hidden={active!=='reservas'}>{reservas}</div>}
 </div>;
}
