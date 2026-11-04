'use client';

import {useEffect,useState} from 'react';

/** Video ornamental: mantiene la imagen de fondo hasta que se puede reproducir. */
export function HomeVideo({src}:{src:string}){
 const [ready,setReady]=useState(false);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{setReady(false);setFailed(false);},[src]);
 if(failed)return null;
 return <video
   className={`hero-background-video${ready?' is-ready':''}`}
   src={src}
   autoPlay muted loop playsInline preload="metadata"
   aria-hidden="true"
   tabIndex={-1}
   onCanPlay={()=>setReady(true)}
   onError={()=>setFailed(true)}
  />;
}
