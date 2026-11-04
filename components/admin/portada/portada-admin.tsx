import Link from 'next/link';
import {Clapperboard,ExternalLink,Video} from 'lucide-react';
import type {HomeCover} from '@/lib/portada-principal';
import {uploadHomeVideo} from '@/app/admin/portada/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';

const messages:Record<string,string>={
 ok:'Video actualizado correctamente. La portada pública ya utiliza el nuevo archivo.',
 archivo:'Selecciona un MP4 válido de hasta 25 MB.',
 config:'Falta configurar Cloudflare R2 en las variables de entorno.',
 tabla:'No se encontró la configuración de portada. Ejecuta el archivo SQL 06 en Supabase.',
 r2:'No se pudo subir el video a Cloudflare R2.',
 db:'El video se subió pero no se pudo guardar en Supabase.',
 denegado:'Solo el administrador general puede cambiar la portada.',
};

export function PortadaAdmin({cover,status}:{cover:HomeCover;status?:string}){
 return <><div className="admin-page-head"><span>INICIO / PORTADA PRINCIPAL</span><h1>Video de la portada</h1><p>Administra el video que aparece detrás del título en la página principal de Los Faroles. No afecta las páginas individuales de las sedes.</p></div>
  {status&&messages[status]&&<div className={status==='ok'?'sede-success':'sede-error'} role={status==='ok'?'status':'alert'}>{messages[status]}</div>}
  <section className="admin-card portada-video-card"><div className="admin-card-head"><h2>Video actual</h2><p>{cover.video_url?'Este es el video publicado en Inicio.':'Todavía no hay un video cargado desde Administración.'}</p></div>
   <div className="portada-video-preview">{cover.video_url?<video src={cover.video_url} controls muted playsInline preload="metadata" aria-label="Video de la portada principal"/>:<div className="portada-video-empty"><Clapperboard size={38}/><strong>Portada sin video administrado</strong><span>Si agregaste un video manualmente en public/videos, seguirá utilizándose hasta que subas uno aquí.</span></div>}</div>
   {cover.video_url&&<div className="portada-video-view"><Link href="/" target="_blank">Ver portada pública <ExternalLink size={15}/></Link></div>}
  </section>
  <section className="admin-card portada-video-card"><div className="admin-card-head"><h2>{cover.video_url?'Reemplazar video':'Subir video de portada'}</h2><p>El archivo anterior se reemplazará solo cuando el nuevo termine de guardarse correctamente.</p></div>
   <form className="portada-video-form" action={uploadHomeVideo}>
    <label className="sede-field"><span>Seleccionar video MP4</span><input type="file" name="video" accept="video/mp4,.mp4" required/><small>Máximo 25 MB · Recomendado: video horizontal de 10 a 20 segundos, sin audio y comprimido para la web.</small></label>
    <div className="portada-video-tip"><Video size={19}/><p>El video se reproduce automáticamente, en silencio y en bucle. Si el navegador no puede reproducirlo, se muestra la imagen de respaldo.</p></div>
    <FormSubmitButton className="gallery-primary" pendingText="Subiendo video, espera..."><Video size={17}/> {cover.video_url?'Guardar nuevo video':'Subir y publicar video'}</FormSubmitButton>
   </form>
  </section>
 </>;
}
