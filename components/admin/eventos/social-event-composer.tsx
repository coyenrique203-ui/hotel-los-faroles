'use client';
import {useEffect,useRef,useState} from 'react';
import {CalendarDays,Camera,Images,ImagePlus,X} from 'lucide-react';
import {createActivity} from '@/app/admin/eventos/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/social-publications.css';

export function SocialEventComposer({sedeId,name}:{sedeId:number;name:string}){
 const [previews,setPreviews]=useState<string[]>([]);
 const [error,setError]=useState('');
 const fileInput=useRef<HTMLInputElement|null>(null);
 useEffect(()=>()=>{previews.forEach(url=>URL.revokeObjectURL(url));},[previews]);
 function updateFiles(files:FileList|null){
  const selected=Array.from(files??[]);
  if(selected.length===0){setPreviews([]);return;}
  if(selected.length>8||selected.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)){
   setError('Selecciona entre 1 y 8 fotografías JPG, PNG o WebP de hasta 8 MB cada una.');
   if(fileInput.current)fileInput.current.value='';
   setPreviews([]);return;
  }
  setError('');setPreviews(selected.map(file=>URL.createObjectURL(file)));
 }
 function clearFiles(){if(fileInput.current)fileInput.current.value='';setPreviews([]);setError('');}
 return <div className="social-composer">
  <div className="social-composer-author"><span className="social-avatar"><Camera size={21}/></span><div><strong>{name}</strong><small>Compartir una celebración o actividad realizada</small></div></div>
  <form className="social-event-form" action={createActivity}>
   <input type="hidden" name="sede_id" value={sedeId}/>
   <label className="social-caption-label">Título de la publicación<input required minLength={3} maxLength={160} name="titulo" placeholder="Ej. Una celebración de quince años inolvidable"/></label>
   <div className="social-event-grid"><label className="social-caption-label"><span><CalendarDays size={15}/> Fecha del evento</span><input name="fecha_evento" type="date"/></label></div>
   <label className="social-caption-label">Cuéntanos sobre este evento<textarea name="descripcion" rows={4} maxLength={1600} placeholder="Una celebración especial llena de momentos inolvidables..."/></label>
   <input className="social-file-input" ref={fileInput} name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={event=>updateFiles(event.target.files)}/>
   {previews.length?<><div className="social-event-gallery">{previews.map((url,index)=><div key={url} className="social-event-image"><img src={url} alt={`Fotografía ${index+1} seleccionada`}/></div>)}</div><button type="button" className="social-upload-drop" style={{minHeight:90}} onClick={()=>fileInput.current?.click()}><ImagePlus size={22}/> Cambiar fotografías ({previews.length}/8)</button><button type="button" onClick={clearFiles} className="experience-danger" style={{justifySelf:'start'}}>Quitar selección <X size={15}/></button></>:<button type="button" className="social-upload-drop" onClick={()=>fileInput.current?.click()}><Images size={34}/><strong>Agregar fotografías del evento</strong><small>Selecciona de 1 a 8 imágenes · JPG, PNG o WebP · máximo 8 MB por foto</small></button>}
   {error&&<p role="alert" className="experience-alert error">{error}</p>}
   <label className="social-event-visible"><input type="checkbox" name="publicado" defaultChecked/> Mostrar esta publicación en la página del salón</label>
   <p className="social-event-note">Comparte únicamente fotos con autorización de las personas que aparecen en ellas.</p>
   <div className="social-composer-footer"><span>Las imágenes se guardarán en la galería de actividades del salón.</span><FormSubmitButton pendingText="Publicando actividad..."><ImagePlus size={17}/> Publicar actividad</FormSubmitButton></div>
  </form>
 </div>;
}
