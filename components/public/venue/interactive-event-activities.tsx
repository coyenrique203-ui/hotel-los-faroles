'use client';
import {useCallback,useState} from 'react';
import {GalleryLightbox,type GalleryPicture} from './gallery-lightbox';
import '@/styles/galeria-ampliada.css';

type Activity={id:number;titulo:string;descripcion:string|null;fecha_evento:string|null;fotos:{id:number;url_publica:string}[]};

export function InteractiveEventActivities({activities}:{activities:Activity[]}){
 const [selected,setSelected]=useState<number|null>(null);
 const [index,setIndex]=useState<number|null>(null);
 const active=activities.find(activity=>activity.id===selected);
 const pictures:GalleryPicture[]=(active?.fotos??[]).map((photo,i)=>({src:photo.url_publica,alt:active!.titulo+' · fotografía '+(i+1)}));
 const close=useCallback(()=>{setSelected(null);setIndex(null);},[]);
 const choose=useCallback((next:number)=>setIndex(next),[]);
 return <><div className="event-activity-grid">{activities.map(activity=>
  <article className="event-activity-card" key={activity.id}>
   <button type="button" className="event-activity-open" onClick={()=>{if(activity.fotos.length){setSelected(activity.id);setIndex(0);}}} disabled={!activity.fotos.length} aria-label={`Ver galería de ${activity.titulo}`}>
    <div className="event-activity-photos">{activity.fotos.slice(0,4).map(photo=><div className="event-activity-image" key={photo.id}><div className="photo" role="img" aria-label={activity.titulo} style={{backgroundImage:`url("${photo.url_publica}")`}}/></div>)}</div>
    <div className="event-activity-content">{activity.fecha_evento&&<time dateTime={activity.fecha_evento}>{new Date(activity.fecha_evento+'T12:00:00').toLocaleDateString('es-GT',{year:'numeric',month:'long'})}</time>}<h3>{activity.titulo}</h3>{activity.descripcion&&<p>{activity.descripcion}</p>}{activity.fotos.length>0&&<span className="event-activity-view">Ver fotografías · {activity.fotos.length}</span>}</div>
   </button>
  </article>)}</div>
  <GalleryLightbox pictures={pictures} current={index} title={active?.titulo??'Evento'} onSelect={choose} onClose={close}/>
 </>;
}
