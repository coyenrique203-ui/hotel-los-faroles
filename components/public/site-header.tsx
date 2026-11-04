'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {DemoAction} from './demo-action';

const links=[
  {href:'/coban',label:'Hotel Cobán',number:'01'},
  {href:'/antigua',label:'Hotel Antigua',number:'02'},
  {href:'/restaurante',label:'Restaurante',number:'03'},
  {href:'/eventos',label:'Salón de eventos',number:'04'},
];

export function SiteHeader({establishments=[]}:{establishments?:{slug:string;nombre:string}[]}){
  const navigationLinks=establishments.length?establishments.map((s,index)=>({href:`/sedes/${s.slug}`,label:s.nombre,number:String(index+1).padStart(2,'0')})):links;
  const pathname=usePathname();
  const home=pathname==='/';
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    const update=()=>setScrolled(window.scrollY>72);
    update();
    window.addEventListener('scroll',update,{passive:true});
    return ()=>window.removeEventListener('scroll',update);
  },[]);

  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{
    if(!open)return;
    const handleKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};
    window.addEventListener('keydown',handleKey);
    return ()=>window.removeEventListener('keydown',handleKey);
  },[open]);

  return <>
    <div className={`site-header ${home?'site-header--home':''} ${scrolled?'site-header--scrolled':''} ${open?'site-header--open':''}`}>
      <header className="header site-header-bar">
        <Link href="/" className="brand site-header-brand" onClick={()=>setOpen(false)} aria-label="Los Faroles, ir al inicio">
          <span aria-hidden="true">✣</span><div>LOS FAROLES<small>HOTELS & EXPERIENCES</small></div>
        </Link>
        <button type="button" className="site-menu-toggle" aria-label={open?'Cerrar menú':'Abrir menú de navegación'} aria-expanded={open} aria-controls="site-navigation" onClick={()=>setOpen(value=>!value)}>
          <span>{open?'CERRAR':'MENÚ'}</span>{open?<X size={25} strokeWidth={1.6}/>:<Menu size={27} strokeWidth={1.5}/>}
        </button>
      </header>
    </div>
    {open&&<button className="site-menu-backdrop" type="button" aria-label="Cerrar menú" onClick={()=>setOpen(false)}/>}
    <nav id="site-navigation" className={`site-menu-panel${open?' is-open':''}`} aria-label="Navegación principal" aria-hidden={!open}>
      <p className="site-menu-eyebrow">EXPLORA LOS FAROLES</p>
      <div className="site-menu-links">
        {navigationLinks.map(link=><Link key={link.href} href={link.href} tabIndex={open?0:-1} onClick={()=>setOpen(false)}><span>{link.number}</span>{link.label}<ArrowUpRight size={22} strokeWidth={1.3}/></Link>)}
      </div>
      <div className="site-menu-bottom"><p>Dos destinos, una misma esencia.<br/>Cobán · Antigua Guatemala</p><DemoAction className="site-menu-booking">RESERVAR ESTANCIA <ArrowUpRight size={18}/></DemoAction></div>
    </nav>
  </>;
}
