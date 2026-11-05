'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,ImagePlus,X} from 'lucide-react';
import {uploadGalleryImages} from '@/app/admin/galeria/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import {UploadProgressOverlay} from '@/components/admin/shared/upload-progress-overlay';
import '@/styles/social-publications.css';

const MAX_FILES=6,MAX_BYTES=24*1024*1024,MAX_FILE=8*1024*1024;
export function SocialPhotoComposer({sedeId,name}:{sedeId:number;name:string}){
 const [files,setFiles]=useState<File[]>([]);
 const [previews,setPreviews]=useState<string[]>([]);
 const [error,setError]=useState('');
 const picker=useRef<HTMLInputElement|null>(null);
 useEffect(()=>{const urls=files.map(file=>URL.createObjectURL(file));setPreviews(urls);return ()=>urls.forEach(url=>URL.revokeObjectURL(url));},[files]);
 function sync(next:File[]){
  const transfer=new DataTransfer();next.forEach(file=>transfer.items.add(file));
  if(picker.current)picker.current.files=transfer.files;
  setFiles(next);
 }
 const select=(selected:FileList|null)=>{
  const incoming=Array.from(selected??[]);
  if(!incoming.length)return;
  const unique=incoming.filter(next=>!files.some(current=>current.name===next.name&&current.size===next.size&&current.lastModified===next.lastModified));
  const combined=[...files,...unique];
  if(combined.length>MAX_FILES){setError('Máximo seis fotografías por publicación.');sync(files);return;}
  if(combined.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>MAX_FILE)){setError('Usa fotografías JPG, PNG o WebP de máximo 8 MB cada una.');sync(files);return;}
  if(combined.reduce((sum,file)=>sum+file.size,0)>MAX_BYTES){setError('Las fotografías no deben superar 24 MB en total.');sync(files);return;}
  setError('');sync(combined);
 };
 const remove=(index:number)=>{sync(files.filter((_,i)=>i!==index));setError('');};
 return <div className="social-composer">
  <div className="social-composer-author"><span className="social-avatar"><Camera size={20}/></span><div><strong>{name}</strong><small>Crear una nueva publicación fotográfica</small></div></div>
  <form action={uploadGalleryImages} className="social-photo-form"><input type="hidden" name="sede_id" value={sedeId}/><input type="hidden" name="return_to" value="sede"/>
   <label className="social-caption-label">Título de la publicación (opcional)<input name="titulo" maxLength={150} placeholder="¿Qué quieres compartir del lugar?"/></label>
   <label className="social-caption-label">Descripción (opcional)<textarea name="texto_alternativo" maxLength={255} rows={2} placeholder="Cuenta qué aparece en estas fotografías..."/></label>
   <input ref={picker} name="imagenes" type="file" accept="image/jpeg,image/png,image/webp" multiple required className="social-file-input" onChange={event=>select(event.target.files)}/>
   {previews.length>0&&<div className="social-event-gallery">{previews.map((url,index)=><div className="social-event-image" key={url}><img src={url} alt={`Fotografía ${index+1} seleccionada`}/><button type="button" onClick={()=>remove(index)} aria-label={`Quitar fotografía ${index+1}`}><X size={16}/></button></div>)}</div>}
   <button className="social-upload-drop" type="button" disabled={files.length>=MAX_FILES} style={files.length?{minHeight:100}:undefined} onClick={()=>picker.current?.click()}><ImagePlus size={files.length?24:32}/><strong>{files.length?'Agregar más fotografías':'Agregar fotografías'}</strong><small>{files.length} de {MAX_FILES} imágenes · Elige varias o agrégalas una a una · Máximo 24 MB en total</small></button>
   {error&&<p className="experience-alert error" role="alert">{error}</p>}
   <div className="social-composer-footer"><span>Se publicarán {files.length} fotografía{files.length===1?'':'s'} en la galería del establecimiento.</span><FormSubmitButton pendingText="Publicando fotografías..."><ImagePlus size={17}/> Publicar fotografías</FormSubmitButton></div>
   <UploadProgressOverlay label="Subiendo tus fotografías..."/>
  </form>
 </div>;
}
