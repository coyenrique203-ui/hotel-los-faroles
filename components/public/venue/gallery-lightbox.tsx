'use client';
import {useEffect,useRef} from 'react';
import {ChevronLeft,ChevronRight,X} from 'lucide-react';

export type GalleryPicture={src:string;alt:string};
export function GalleryLightbox({pictures,current,title,onSelect,onClose}:{pictures:GalleryPicture[];current:number|null;title:string;onSelect:(index:number)=>void;onClose:()=>void}){
 const closeRef=useRef<HTMLButtonElement|null>(null);
 useEffect(()=>{
  if(current===null||!pictures.length)return;
  const originalOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  closeRef.current?.focus();
  const keydown=(event:KeyboardEvent)=>{
   if(event.key==='Escape')onClose();
   if(event.key==='ArrowRight'){event.preventDefault();onSelect((current+1)%pictures.length);}
   if(event.key==='ArrowLeft'){event.preventDefault();onSelect((current-1+pictures.length)%pictures.length);}
  };
  document.addEventListener('keydown',keydown);
  return ()=>{document.body.style.overflow=originalOverflow;document.removeEventListener('keydown',keydown);};
 },[current,pictures.length,onClose,onSelect]);
 if(current===null||!pictures[current])return null;
 return <div className="experience-lightbox" role="dialog" aria-modal="true" aria-label={`Galería de ${title}`} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <button ref={closeRef} type="button" className="experience-lightbox-close" onClick={onClose} aria-label="Cerrar galería"><X size={25}/></button>
  <div className="experience-lightbox-stage">
   {pictures.length>1&&<button className="experience-lightbox-prev" type="button" onClick={()=>onSelect((current-1+pictures.length)%pictures.length)} aria-label="Fotografía anterior"><ChevronLeft size={28}/></button>}
   <figure><img src={pictures[current].src} alt={pictures[current].alt}/><figcaption>{title} <span>{current+1} / {pictures.length}</span></figcaption></figure>
   {pictures.length>1&&<button className="experience-lightbox-next" type="button" onClick={()=>onSelect((current+1)%pictures.length)} aria-label="Fotografía siguiente"><ChevronRight size={28}/></button>}
  </div>
 </div>;
}
