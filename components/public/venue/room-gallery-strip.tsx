'use client';
import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight,X,Images} from 'lucide-react';

type Picture={src:string;alt:string};
export function RoomGalleryStrip({fotos,nombre}:{fotos:Picture[];nombre:string}){
 const [current,setCurrent]=useState<number|null>(null);
 useEffect(()=>{
  if(current===null)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setCurrent(null);if(e.key==='ArrowRight')setCurrent(v=>v===null?v:(v+1)%fotos.length);if(e.key==='ArrowLeft')setCurrent(v=>v===null?v:(v-1+fotos.length)%fotos.length)};
  document.addEventListener('keydown',onKey);return ()=>document.removeEventListener('keydown',onKey);
 },[current,fotos.length]);
 if(!fotos.length)return null;
 return <><div className="room-photo-thumbs" aria-label={`Galería de ${nombre}`}>{fotos.slice(0,4).map((p,i)=><button type="button" onClick={()=>setCurrent(i)} key={p.src} aria-label={`Ver foto ${i+1} de ${nombre}`}><img src={p.src} alt={p.alt}/>{i===3&&fotos.length>4&&<span>+{fotos.length-4}</span>}</button>)}</div><button className="room-view-gallery" onClick={()=>setCurrent(0)} type="button"><Images size={14}/> Ver galería ({fotos.length})</button>
 {current!==null&&<div className="room-lightbox" role="dialog" aria-modal="true" aria-label={`Galería de ${nombre}`}><button className="room-lightbox-close" onClick={()=>setCurrent(null)} aria-label="Cerrar galería"><X size={25}/></button><div className="room-lightbox-body"><button onClick={()=>setCurrent((current-1+fotos.length)%fotos.length)} aria-label="Imagen anterior"><ChevronLeft/></button><figure><img src={fotos[current].src} alt={fotos[current].alt}/><figcaption>{nombre} · {current+1} de {fotos.length}</figcaption></figure><button onClick={()=>setCurrent((current+1)%fotos.length)} aria-label="Imagen siguiente"><ChevronRight/></button></div></div>}</>;
}
