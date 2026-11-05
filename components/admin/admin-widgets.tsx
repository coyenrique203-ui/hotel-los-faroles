import Link from 'next/link';
import {ArrowUpRight,Building2,UtensilsCrossed,PartyPopper} from 'lucide-react';
import {adminModules} from '@/lib/admin-modules';
import type {Sede} from '@/lib/admin/sedes';

export function AdminDashboard({adminRole='general',sedes=[]}:{adminRole?:'general'|'sede';sedes?:Sede[]}){
 const hotels=sedes.filter(s=>s.tipo==='hotel').length;
 const restaurants=sedes.filter(s=>s.tipo==='restaurante').length;
 const venues=sedes.filter(s=>s.tipo==='eventos').length;
 return <><div className="admin-page-head"><span>INICIO / RESUMEN</span><h1>Bienvenido a Los Faroles.</h1><p>Administra los establecimientos, las fotografías y el contenido desde un solo lugar.</p></div>
 <div className="admin-stat-grid">
  <div><Building2/><span>HOTELES</span><strong>{hotels}</strong><small>Sedes disponibles</small></div>
  <div><UtensilsCrossed/><span>RESTAURANTES</span><strong>{restaurants}</strong><small>Establecimientos disponibles</small></div>
  <div><PartyPopper/><span>SALONES DE EVENTOS</span><strong>{venues}</strong><small>Espacios disponibles</small></div>
 </div>
 <div className="admin-card"><div className="admin-card-head"><h2>Administrar contenido</h2><p>Selecciona una sección para continuar.</p></div><div className="admin-shortcuts">{adminModules.filter(m=>m.slug&&!['reservas','contenido','configuracion'].includes(m.slug)&&(adminRole==='general'||!['usuarios','portada'].includes(m.slug))).map(m=><Link href={'/admin/'+m.slug} key={m.slug}><m.icon size={22}/><div><strong>{m.label}</strong><small>{m.description}</small></div><ArrowUpRight size={17}/></Link>)}</div></div>
 </>;
}

export function AdminModule({slug}:{slug:string}){
 const item=adminModules.find(m=>m.slug===slug)!;
 return <><div className="admin-page-head"><span>INICIO / {item.label.toUpperCase()}</span><h1>{item.label}</h1><p>{item.description}</p></div>
 <div className="admin-card"><div className="admin-card-head"><h2>{item.label}</h2><p>Selecciona una sección del menú de administración para continuar.</p></div></div></>;
}
