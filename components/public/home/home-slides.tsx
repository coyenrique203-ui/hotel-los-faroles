'use client';
import {useEffect,useState} from 'react';
import type {HomeSlide} from '@/lib/portada-principal';

export function HomeSlides({slides}:{slides:HomeSlide[]}){
 const [active,setActive]=useState(0);
 useEffect(()=>{setActive(0);},[slides]);
 useEffect(()=>{
  if(slides.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const timer=window.setInterval(()=>setActive(index=>(index+1)%slides.length),5500);
  return ()=>window.clearInterval(timer);
 },[slides]);
 if(!slides.length)return null;
 return <div className="hero-background-slides" aria-hidden="true">
  {slides.map((slide,index)=><div key={slide.clave_r2} className={'hero-background-slide'+(active===index?' is-active':'')} style={{backgroundImage:`url("${slide.url}")`}}/>)}
 </div>;
}
