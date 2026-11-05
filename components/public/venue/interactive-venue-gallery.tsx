'use client';
import {useCallback,useState} from 'react';
import {GalleryLightbox,type GalleryPicture} from './gallery-lightbox';
import '@/styles/galeria-ampliada.css';

export function InteractiveVenueGallery({pictures,title}:{pictures:GalleryPicture[];title:string}){
 const [current,setCurrent]=useState<number|null>(null);
 const close=useCallback(()=>setCurrent(null),[]);
 const select=useCallback((index:number)=>setCurrent(index),[]);
 return <><div className="venue-photo-grid venue-photo-grid-interactive">{pictures.map((picture,index)=>
  <button key={picture.src+'-'+index} className="venue-photo-button" type="button" onClick={()=>setCurrent(index)} aria-label={`Ampliar fotografía ${index+1} de ${title}`}>
   <span className="photo" role="img" aria-label={picture.alt} style={{backgroundImage:`url("${picture.src}")`}}/>
   <span className="venue-photo-zoom">Ver fotografía</span>
  </button>)}</div>
  <GalleryLightbox pictures={pictures} current={current} title={title} onSelect={select} onClose={close}/>
 </>;
}
