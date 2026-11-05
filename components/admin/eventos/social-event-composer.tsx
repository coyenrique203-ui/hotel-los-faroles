'use client';
import {useEffect,useRef,useState} from 'react';
import {CalendarDays,Camera,Images,ImagePlus,X} from 'lucide-react';
import {createActivity} from '@/app/admin/eventos/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import {UploadProgressOverlay} from '@/components/admin/shared/upload-progress-overlay';
import '@/styles/social-publications.css';

const MAX_FILES=8,MAX_TOTAL=24*1024*1024,MAX_FILE=8*1024*1024;
const validTypes=['image/jpeg','image/png','image/webp'];

export function SocialEventComposer({sedeId,name}:{sedeId:number;name:string}){
 const [files,setFiles]=useState<File[]>([]);
 const [previews,setPreviews]=useState<string[]>([]);
 const [error,setError]=useState('');
 const fileInput=useRef<HTMLInputElement|null>(null);
 useEffect(()=>{
  const urls=files.map(file=>URL.createObjectURL(file));setPreviews(urls);
  return ()=>urls.forEach(url=>URL.revokeObjectURL(url));
 },[files]);
 function sync(list:File[]){
  const transfer=new DataTransfer();
  list.forEach(file=>transfer.items.add(file));
  if(fileInput.current)fileInput.current.files=transfer.files;
  setFiles(list);
 }
 function updateFiles(selected:FileList|null){
  const incoming=Array.from(selected??[]);
  if(!incoming.length)return;
  // El navegador reemplaza FileList en cada selección: recuperamos el estado anterior.
  const unique=incoming.filter(next=>!files.some(current=>current.name===next.name&&current.size===next.size&&current.lastModified===next.lastModified));
  const combined=[...files,...unique];
  if(combined.length>MAX_FILES){setError('Puedes adjuntar hasta ocho fotografías por evento.');sync(files);return;}
  if(combined.some(file=>!validTypes.includes(file.type)||file.size>MAX_FILE)){setError('Usa imágenes JPG, PNG o WebP de máximo 8 MB cada una.');sync(files);return;}
  if(combined.reduce((sum,file)=>sum+file.size,0)>MAX_TOTAL){setError('Para evitar cargas lentas, las fotografías juntas no deben superar 24 MB.');sync(files);return;}
  setError('');sync(combined);
 }
 function removeFile(index:number){sync(files.filter((_,i)=>i!==index));setError('');}
 function clearFiles(){sync([]);setError('');}
 return <div className="social-composer">
  <div className="social-composer-author"><span className="social-avatar"><Camera size={21}/></span><div><strong>{name}</strong><small>Compartir una celebración o actividad realizada</small></div></div>
  <form className="social-event-form" action={createActivity}>
   <input type="hidden" name="sede_id" value={sedeId}/>
   <label className="social-caption-label">Título de la publicación<input required minLength={3} maxLength={160} name="titulo" placeholder="Ej. Una celebración de quince años inolvidable"/></label>
   <div className="social-event-grid"><label className="social-caption-label"><span><CalendarDays size={15}/> Fecha del evento</span><input name="fecha_evento" type="date"/></label></div>
   <label className="social-caption-label">Cuéntanos sobre este evento<textarea name="descripcion" rows={4} maxLength={1600} placeholder="Una celebración especial llena de momentos inolvidables..."/></label>
   <input className="social-file-input" ref={fileInput} name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={event=>updateFiles(event.target.files)}/>
   {previews.length>0&&<div className="social-event-gallery">{previews.map((url,index)=><div key={url} className="social-event-image"><img src={url} alt={`Fotografía ${index+1} seleccionada`}/><button type="button" onClick={()=>removeFile(index)} aria-label={`Quitar fotografía ${index+1}`}><X size={16}/></button></div>)}</div>}
   <button type="button" className="social-upload-drop" disabled={files.length>=MAX_FILES} style={files.length?{minHeight:100}:undefined} onClick={()=>fileInput.current?.click()}><Images size={files.length?24:34}/><strong>{files.length?'Agregar más fotografías':'Agregar fotografías del evento'}</strong><small>{files.length} de {MAX_FILES} imágenes · Puedes seleccionar varias o agregarlas una por una · Total máximo 24 MB</small></button>
   {!!files.length&&<button type="button" className="social-clear-selection" onClick={clearFiles}>Quitar todas las fotografías</button>}
   {error&&<p role="alert" className="experience-alert error">{error}</p>}
   <label className="social-event-visible"><input type="checkbox" name="publicado" defaultChecked/> Mostrar esta publicación en la página del salón</label>
   <p className="social-event-note">Comparte únicamente fotos con autorización de las personas que aparecen en ellas.</p>
   <div className="social-composer-footer"><span>Las imágenes se guardarán en la galería de actividades del salón.</span><FormSubmitButton pendingText="Publicando actividad..."><ImagePlus size={17}/> Publicar actividad</FormSubmitButton></div>
   <UploadProgressOverlay label="Publicando tu evento..."/>
  </form>
 </div>;
}
