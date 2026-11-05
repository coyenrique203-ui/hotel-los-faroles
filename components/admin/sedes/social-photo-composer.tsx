'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,ImagePlus,X} from 'lucide-react';
import {uploadGalleryImage} from '@/app/admin/galeria/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/social-publications.css';

export function SocialPhotoComposer({sedeId,name}:{sedeId:number;name:string}){
 const [preview,setPreview]=useState<string|null>(null);
 const [fileName,setFileName]=useState('');
 const picker=useRef<HTMLInputElement|null>(null);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview);},[preview]);
 const select=(file:File|undefined)=>{
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){window.alert('Selecciona una imagen JPG, PNG o WebP de hasta 8 MB.');return;}
  setPreview(URL.createObjectURL(file));setFileName(file.name);
 };
 return <div className="social-composer"><div className="social-composer-author"><span className="social-avatar"><Camera size={20}/></span><div><strong>{name}</strong><small>Crear una nueva fotografía</small></div></div>
 <form action={uploadGalleryImage} className="social-photo-form"><input type="hidden" name="sede_id" value={sedeId}/><input type="hidden" name="return_to" value="sede"/>
 <label className="social-caption-label">Título o descripción de la publicación<input name="titulo" maxLength={150} placeholder="¿Qué quieres compartir del lugar?"/></label>
 <label className="social-caption-label">Descripción de la fotografía (opcional)<textarea name="texto_alternativo" maxLength={255} rows={2} placeholder="Cuenta qué aparece en esta imagen..."/></label>
 <input ref={picker} name="imagen" type="file" accept="image/jpeg,image/png,image/webp" required className="social-file-input" onChange={e=>select(e.target.files?.[0])}/>
 {preview?<div className="social-photo-preview"><img src={preview} alt="Vista previa de la fotografía seleccionada"/><button type="button" onClick={()=>{if(picker.current)picker.current.value='';setPreview(null);setFileName('')}} aria-label="Quitar imagen"><X size={18}/></button><span>{fileName}</span></div>:<button className="social-upload-drop" type="button" onClick={()=>picker.current?.click()}><ImagePlus size={32}/><strong>Agregar fotografía</strong><small>JPG, PNG o WebP · máximo 8 MB</small></button>}
 <div className="social-composer-footer"><span>Se guardará en la galería del establecimiento.</span><FormSubmitButton pendingText="Publicando fotografía..."><ImagePlus size={17}/> Publicar fotografía</FormSubmitButton></div>
 </form></div>;
}
