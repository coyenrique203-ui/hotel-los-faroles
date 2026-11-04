'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {adminModules} from '@/lib/admin-modules';
import {logoutAction} from '@/app/admin/actions';
import {LogOut} from 'lucide-react';
export function AdminShell({children,adminName}:{children:React.ReactNode;adminName:string}){
 const pathname=usePathname(),[open,setOpen]=useState(false);
 return <div className="admin-app"><aside className={open?'admin-sidebar open':'admin-sidebar'}><Link className="admin-logo" href="/admin"><span>✣</span><div>LOS FAROLES<small>ADMINISTRACIÓN</small></div></Link><div className="admin-nav-label">PANEL DE CONTROL</div><nav>{adminModules.map(({slug,label,icon:Icon})=><Link key={slug} href={'/admin'+(slug?'/'+slug:'')} className={pathname===('/admin'+(slug?'/'+slug:''))?'active':''} onClick={()=>setOpen(false)}><Icon size={18}/>{label}</Link>)}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank">VER SITIO PÚBLICO <ArrowUpRight size={16}/></Link><small>PROTOTIPO · SIN DATOS REALES</small></div></aside>
 <div className="admin-main"><header className="admin-topbar"><button className="admin-mobile-toggle" onClick={()=>setOpen(!open)} aria-label="Abrir navegación">{open?<X/>:<Menu/>}</button><div><span>LOS FAROLES</span><strong>Panel de administración · {adminName}</strong></div><form action={logoutAction}><button type="submit" className="admin-logout"><LogOut size={16}/> CERRAR SESIÓN</button></form></header><div className="admin-content">{children}</div></div></div>
}
