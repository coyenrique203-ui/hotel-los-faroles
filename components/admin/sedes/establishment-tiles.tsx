import Link from 'next/link';
import {ArrowUpRight,MapPin,UtensilsCrossed,CalendarDays} from 'lucide-react';
import type {Sede} from '@/lib/admin/sedes';
import '@/styles/sedes-dinamicas.css';

export function EstablishmentTiles({sedes,kind}:{sedes:Sede[];kind:'restaurante'|'eventos'}){
 const restaurant=kind==='restaurante';
 const Icon=restaurant?UtensilsCrossed:CalendarDays;
 const singular=restaurant?'restaurante':'salón de eventos';
 return <div className="admin-card"><div className="admin-card-head"><h2>{restaurant?'Restaurantes':'Salones de eventos'}</h2><p>{sedes.length} {sedes.length===1?singular:restaurant?'restaurantes':'salones de eventos'} disponible{sedes.length===1?'':'s'} para tu usuario</p></div>
 {sedes.length?<div className="sedes-grid">{sedes.map(s=><Link href={`/admin/${kind}/${s.id}`} className="sede-tile" key={s.id}>
 <div className="sede-tile-icon"><Icon size={24}/></div><div className="sede-tile-body"><span className="sede-tile-type">{restaurant?'RESTAURANTE':'SALÓN DE EVENTOS'}</span><h3>{s.nombre}</h3><p><MapPin size={14}/>{s.direccion||'Dirección pendiente de completar'}</p><span className={s.publicado?'sede-published':'sede-draft'}>{s.publicado?'Publicado':'Sin publicar'}</span></div><ArrowUpRight className="sede-tile-arrow" size={18}/>
 </Link>)}</div>:<div className="admin-empty sedes-empty">No tienes {restaurant?'restaurantes':'salones'} asignados o todavía no se ha creado ninguno.</div>}
 </div>;
}
