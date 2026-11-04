'use client';
import {useState} from 'react';
import {AMENITY_GROUPS,ROOM_AMENITIES} from '@/lib/room-amenities';
import '@/styles/room-amenities.css';

export function RoomAmenitiesEditor({selected=[]}:{selected?:string[]}){
 const known=new Set<string>(ROOM_AMENITIES.map(a=>a.id));
 const [values,setValues]=useState<string[]>(selected);
 const [custom,setCustom]=useState('');
 const extras=values.filter(item=>!known.has(item));
 const toggle=(id:string)=>setValues(items=>items.includes(id)?items.filter(v=>v!==id):[...items,id]);
 const add=()=>{const text=custom.trim().replace(/\s+/g,' ').slice(0,60);if(text&&!values.includes(text))setValues(v=>[...v,text]);setCustom('');};
 return <section className="room-amenities-editor"><div className="room-amenities-heading"><h3>Características y comodidades</h3><p>Selecciona los servicios que realmente ofrece este tipo de habitación. Se mostrarán en su tarjeta pública.</p></div>
  {AMENITY_GROUPS.map(group=><div key={group} className="room-amenity-group"><strong>{group}</strong><div className="room-amenity-options">{ROOM_AMENITIES.filter(item=>item.group===group).map(item=><label key={item.id} className={values.includes(item.id)?'selected':''}><input type="checkbox" name="comodidad" value={item.id} checked={values.includes(item.id)} onChange={()=>toggle(item.id)}/>{item.label}</label>)}</div></div>)}
  <div className="room-amenity-custom"><label htmlFor="room-custom-amenity">Otra característica (opcional)</label><div><input id="room-custom-amenity" type="text" maxLength={60} value={custom} placeholder="Ej. Terraza con vista al jardín" onChange={e=>setCustom(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add();}}}/><button type="button" onClick={add}>Agregar</button></div>{extras.length>0&&<div className="room-amenity-extras">{extras.map(item=><span key={item}>{item}<button type="button" aria-label={`Quitar ${item}`} onClick={()=>toggle(item)}>×</button></span>)}</div>}
   {extras.map(item=><input key={item} type="hidden" name="comodidad" value={item}/>)}
  </div>
 </section>;
}
