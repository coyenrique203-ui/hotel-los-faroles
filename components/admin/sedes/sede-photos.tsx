import {Camera, ImagePlus, Star, Eye, EyeOff, Images} from 'lucide-react';
import type {Sede} from '@/lib/admin/sedes';
import type {GalleryImage} from '@/lib/admin/galeria';
import {uploadGalleryImage, changeGalleryImage} from '@/app/admin/galeria/actions';
import {DeleteButton} from '@/components/admin/galeria/delete-button';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import {SocialPhotoComposer} from './social-photo-composer';

const messages:Record<string,string>={
 subida:'Fotografía subida correctamente.',guardado:'Fotografías actualizadas.',
 config:'Es necesario revisar la configuración de Cloudflare R2.',
 archivo:'Selecciona una imagen JPG, PNG o WebP de hasta 8 MB.',
 r2:'No se pudo cargar la imagen. Revisa el almacenamiento R2.',
 db:'La fotografía no se pudo guardar en la base de datos.',
 error:'No fue posible completar esta operación.',
 denegado:'No tienes permisos para editar estas fotografías.',
 r2delete:'Se retiró la fotografía, pero no fue posible borrar su archivo de R2.'
};

export function SedePhotos({sede,imagenes,status,social=false}:{sede:Sede;imagenes:GalleryImage[];status?:string;social?:boolean}){
 const featured=imagenes.find(image=>image.destacada);
 const principal=featured?.url_publica??sede.imagen_principal;
 const isError=status&&['config','archivo','r2','db','error','denegado','r2delete'].includes(status);
 return <div className="sede-photo-editor" id="fotografias">
  <div className="sede-photo-heading"><span><Camera size={17}/> FOTOGRAFÍAS DE LA SEDE</span><h2>Imágenes y portada</h2><p>Agrega fotografías y elige cuál aparecerá como imagen principal en la página de {sede.nombre}. Todo se administra aquí mismo.</p></div>
  {status&&messages[status]&&<div role={isError?'alert':'status'} className={isError?'sede-error':'sede-success'}>{messages[status]}</div>}
  <section className="admin-card"><div className="admin-card-head"><h2>Imagen principal</h2><p>Es la fotografía que destaca en la portada de esta sede.</p></div><div className="sede-featured-content">
   <div className="sede-featured-preview">{principal?<img src={principal} alt={`Portada de ${sede.nombre}`}/>:<div className="sede-no-featured"><Images size={34}/><span>Aún no hay imagen principal</span></div>}</div>
   <div className="sede-featured-aside"><span className="sede-featured-label"><Star size={15}/> PORTADA ACTUAL</span><h3>{principal?'Tu sede ya tiene una portada':'Elige una foto para la portada'}</h3><p>Para cambiarla, sube una fotografía o pulsa <strong>«Usar como portada»</strong> en cualquiera de las imágenes de abajo.</p><small>Las fotos se guardan en Cloudflare R2.</small></div>
  </div></section>
  {social?<section className="admin-card social-photo-section"><SocialPhotoComposer sedeId={sede.id} name={sede.nombre}/></section>:<>{  <section className="admin-card"><div className="admin-card-head"><h2>Agregar fotografía</h2><p>JPG, PNG o WebP · Hasta 8 MB</p></div>
   <form action={uploadGalleryImage} className="gallery-upload"><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="return_to" value="sede"/>
    <label className="sede-field"><span>Selecciona una fotografía</span><input name="imagen" type="file" accept="image/jpeg,image/png,image/webp" required/></label>
    <div className="sede-form-grid"><label className="sede-field"><span>Título (opcional)</span><input name="titulo" maxLength={150} placeholder="Ej. Jardín interior"/></label><label className="sede-field"><span>Descripción de la imagen (opcional)</span><input name="texto_alternativo" maxLength={255} placeholder="Describe lo que se ve"/></label></div>
    <FormSubmitButton className="gallery-primary" pendingText="Subiendo fotografía..."><ImagePlus size={17}/> Subir fotografía</FormSubmitButton>
   </form>
  </section>
}</>}
  <section className="admin-card"><div className="admin-card-head"><h2>Fotografías de {sede.nombre}</h2><p>{imagenes.length} fotografía{imagenes.length===1?'':'s'} · Selecciona la portada y decide cuáles estarán visibles.</p></div>
   {imagenes.length?<div className="gallery-grid">{imagenes.map(img=><article key={img.id} className="gallery-photo"><div className="gallery-photo-preview"><img src={img.url_publica} alt={img.texto_alternativo||img.titulo||'Fotografía de la sede'} loading="lazy"/>{img.destacada&&<span className="gallery-featured"><Star size={13} fill="currentColor"/> PORTADA</span>}</div><div className="gallery-photo-info"><strong>{img.titulo||img.nombre_archivo}</strong><small>{img.publicada?'Visible en el sitio':'Oculta en el sitio'}</small><form action={changeGalleryImage} className="gallery-photo-actions"><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="imagen_id" value={img.id}/><input type="hidden" name="return_to" value="sede"/>{!img.destacada&&<FormSubmitButton name="operacion" value="destacar" pendingText="Aplicando..."><Star size={14}/> Usar como portada</FormSubmitButton>}<FormSubmitButton name="operacion" value={img.publicada?'ocultar':'mostrar'} pendingText="Actualizando...">{img.publicada?<EyeOff size={14}/>:<Eye size={14}/>} {img.publicada?'Ocultar':'Mostrar'}</FormSubmitButton><DeleteButton/></form></div></article>)}</div>:<div className="gallery-empty"><Images size={32}/><p>Todavía no hay fotografías de esta sede. Agrega la primera arriba; se usará automáticamente como portada.</p></div>}
  </section>
 </div>;
}
