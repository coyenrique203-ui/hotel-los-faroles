'use client';
import {useState} from 'react';
import Link from 'next/link';
import {Clapperboard,ExternalLink,Video,Images,Image as ImageIcon,Trash2,Check,UploadCloud} from 'lucide-react';
import type {HomeCover} from '@/lib/portada-principal';
import {setHomeCoverMode,uploadHomeVideo,uploadHomeImage,uploadHomeSlides,removeHomeSlide} from '@/app/admin/portada/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/portada-multimedia.css';

type Mode=HomeCover['modo'];
const modes:{id:Mode;title:string;description:string}[]=[
 {id:'video',title:'Video',description:'Una portada dinámica en reproducción continua.'},
 {id:'carrusel',title:'Carrusel de imágenes',description:'Varias fotografías que cambian automáticamente.'},
 {id:'imagen',title:'Imagen fija',description:'Una sola fotografía de gran impacto.'},
];
const messages:Record<string,string>={
 video:'Video publicado correctamente.',imagen:'Imagen principal publicada correctamente.',
 carrusel:'Fotografías agregadas al carrusel.',eliminada:'Fotografía retirada del carrusel.',
 modo:'Se actualizó el tipo de portada.',archivo:'Selecciona imágenes JPG, PNG o WebP de hasta 8 MB (24 MB por carga).',
 videoarchivo:'Selecciona un video MP4 válido de hasta 25 MB.',
 limite:'El carrusel permite un máximo de ocho fotografías.',sinimagen:'Primero sube una imagen fija.',
 sinfotos:'Primero agrega al menos una fotografía al carrusel.',
 invalid:'La selección no es válida.',config:'Revisa la configuración de Cloudflare R2.',
 tabla:'Es necesario ejecutar el SQL de portada multimedia en Supabase.',
 r2:'No se pudo subir el archivo a Cloudflare R2.',db:'No se pudo guardar el cambio en Supabase.',
 denegado:'Solo el administrador general puede editar la portada.',
};
const errors=new Set(['archivo','videoarchivo','limite','sinimagen','sinfotos','invalid','config','tabla','r2','db','denegado']);

export function PortadaAdmin({cover,status}:{cover:HomeCover;status?:string}){
 const [selected,setSelected]=useState<Mode>(cover.modo);
 const [files,setFiles]=useState<File[]>([]);
 const assetAvailable=(mode:Mode)=>mode==='video'?Boolean(cover.video_url):mode==='imagen'?Boolean(cover.imagen_url):cover.carrusel.length>0;
 const selectedMode=modes.find(mode=>mode.id===selected)!;
 return <div className="portada-editor">
  <div className="admin-page-head"><span>INICIO / PORTADA PRINCIPAL</span><h1>Portada principal</h1><p>Elige cómo presentar Los Faroles en la página de inicio. Conservaremos tus archivos al cambiar de formato.</p></div>
  {status&&messages[status]&&<div className={errors.has(status)?'sede-error':'sede-success'} role={errors.has(status)?'alert':'status'}>{messages[status]}</div>}
  <section className="admin-card portada-mode-card"><div className="admin-card-head"><h2>Formato de portada</h2><p>Selecciona el estilo que deseas configurar.</p></div>
   <div className="portada-mode-grid">
    {modes.map(mode=><button type="button" key={mode.id} onClick={()=>{setSelected(mode.id);setFiles([]);}} className={'portada-mode-option'+(selected===mode.id?' is-selected':'')} aria-pressed={selected===mode.id}>
      <span className="portada-mode-icon">{mode.id==='video'?<Video size={23}/>:mode.id==='carrusel'?<Images size={23}/>:<ImageIcon size={23}/>}</span>
      <strong>{mode.title}</strong><small>{mode.description}</small>
      {cover.modo===mode.id&&<span className="portada-active-label"><Check size={13}/> ACTIVA</span>}
    </button>)}
   </div>
  </section>
  <section className="admin-card portada-media-card">
   <div className="admin-card-head portada-media-heading"><div><span className="portada-overline">CONFIGURACIÓN</span><h2>{selectedMode.title}</h2><p>{selectedMode.description}</p></div>
    {cover.modo!==selected&&assetAvailable(selected)&&<form action={setHomeCoverMode}><input type="hidden" name="modo" value={selected}/><FormSubmitButton pendingText="Activando portada..." className="portada-activate">Usar esta portada <Check size={16}/></FormSubmitButton></form>}
   </div>
   {selected==='video'&&<div className="portada-media-body">
    {cover.video_url?<video className="portada-preview-media" src={cover.video_url} controls muted playsInline preload="metadata" aria-label="Vista previa del video"/>:<div className="portada-empty-preview"><Clapperboard size={34}/><strong>Portada de video</strong><p>Sube un MP4 para reemplazar el video de respaldo incluido en el sitio.</p></div>}
    <form action={uploadHomeVideo} className="portada-upload-form"><label className="sede-field"><span>{cover.video_url?'Reemplazar video':'Subir un video'}</span><input type="file" name="video" accept="video/mp4,.mp4" required/><small>MP4, máximo 25 MB. Recomendado: horizontal, 10–20 segundos y sin sonido.</small></label><FormSubmitButton className="gallery-primary" pendingText="Subiendo video..."><UploadCloud size={17}/> Subir y publicar video</FormSubmitButton></form>
   </div>}
   {selected==='imagen'&&<div className="portada-media-body">
    {cover.imagen_url?<img className="portada-preview-media" src={cover.imagen_url} alt="Vista previa de la imagen fija"/>:<div className="portada-empty-preview"><ImageIcon size={34}/><strong>Una imagen protagonista</strong><p>Elige una fotografía horizontal de alta calidad.</p></div>}
    <form action={uploadHomeImage} className="portada-upload-form"><label className="sede-field"><span>{cover.imagen_url?'Reemplazar imagen':'Subir imagen principal'}</span><input type="file" name="imagen" accept="image/jpeg,image/png,image/webp" required/><small>JPG, PNG o WebP · Hasta 8 MB. Se adaptará a pantallas de distintos tamaños.</small></label><FormSubmitButton className="gallery-primary" pendingText="Guardando imagen..."><UploadCloud size={17}/> Subir y publicar imagen</FormSubmitButton></form>
   </div>}
   {selected==='carrusel'&&<div className="portada-media-body">
    <div className="portada-slide-heading"><strong>{cover.carrusel.length} de 8 fotografías</strong><span>Las imágenes cambian cada 5.5 segundos en la portada.</span></div>
    {cover.carrusel.length?<div className="portada-slide-grid">{cover.carrusel.map((slide,index)=><article className="portada-slide-card" key={slide.clave_r2}><img src={slide.url} alt={`Imagen ${index+1} del carrusel`}/><div><span>FOTO {index+1}</span><form action={removeHomeSlide} onSubmit={event=>{if(!window.confirm('¿Quitar esta fotografía del carrusel?'))event.preventDefault();}}><input type="hidden" name="clave_r2" value={slide.clave_r2}/><FormSubmitButton pendingText="Quitando fotografía..." className="portada-remove-slide"><Trash2 size={15}/> Quitar</FormSubmitButton></form></div></article>)}</div>:<div className="portada-empty-preview"><Images size={34}/><strong>Aún no hay fotografías</strong><p>Agrega tus imágenes para crear una secuencia visual.</p></div>}
    {cover.carrusel.length<8&&<form action={uploadHomeSlides} className="portada-upload-form"><label className="sede-field"><span>Agregar fotografías</span><input type="file" name="imagenes" accept="image/jpeg,image/png,image/webp" multiple required onChange={event=>setFiles(Array.from(event.target.files??[]))}/><small>Puedes seleccionar varias a la vez · Máximo 8 en total · Hasta 8 MB por archivo y 24 MB por carga.</small></label><span className="portada-file-count">{files.length?files.length+' archivo(s) seleccionado(s)':'Puedes añadir fotografías en distintas cargas.'}</span><FormSubmitButton className="gallery-primary" pendingText="Publicando fotografías..."><UploadCloud size={17}/> Agregar y publicar</FormSubmitButton></form>}
   </div>}
  </section>
  <div className="portada-footer-link"><Link href="/" target="_blank">Ver la portada pública <ExternalLink size={16}/></Link></div>
 </div>;
}
