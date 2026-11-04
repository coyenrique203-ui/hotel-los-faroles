import 'server-only';
import {createClient} from '@/lib/supabase/server';
import {venues,type Venue} from '@/lib/hotel-content';

type SedePublica={id:number;nombre:string;slug:string;tipo:string;descripcion:string|null;direccion:string|null;telefono:string|null;telefonos_adicionales:string[]|null;google_maps_url:string|null;google_rating:number|null;google_reviews_count:number|null;google_reviews_checked_at:string|null;whatsapp:string|null;email:string|null;imagen_principal:string|null};
type ImagenPublica={url_publica:string;texto_alternativo:string|null;titulo:string|null;destacada:boolean};
type TipoHabitacionPublica={id:number;nombre:string;descripcion_corta:string|null;descripcion_detallada:string|null;capacidad_personas:number;cantidad_camas:number;tipo_cama:string|null;precio_desde:number|null;imagen_principal:string|null;comodidades:string[]};

export type PublicRoom={id:number;nombre:string;descripcion:string;descripcionDetallada?:string;capacidad:number;camas:number;tipoCama:string|null;precioDesde:number|null;imagen:string|null;fotos:{src:string;alt:string}[];comodidades?:string[]};

export type PublicVenue=Venue&{
 oficial:boolean;
 imagenesOficiales:boolean;
 heroOficial?:boolean;
 direccion?:string;
 telefono?:string;
 telefonosAdicionales?:string[];
 sedeId?:number;
 googleRating?:number|null; googleReviewsCount?:number|null; googleReviewsCheckedAt?:string|null;
 googleMapsUrl?:string;
 whatsapp?:string;
 email?:string;
 galleryItems?:{src:string;alt:string}[];
 rooms?:PublicRoom[];
};

export async function getPublicVenue(slug:'coban'|'antigua'|'restaurante'|'eventos'):Promise<PublicVenue>{
 const fallback=venues[slug];
 try{
  const db=await createClient();
  // El filtro explícito se aplica incluso cuando un administrador está autenticado.
  const {data,error}=await db.from('sedes')
   .select('id,nombre,slug,tipo,descripcion,direccion,telefono,telefonos_adicionales,google_maps_url,google_rating,google_reviews_count,google_reviews_checked_at,whatsapp,email,imagen_principal')
   .eq('slug',slug).eq('publicado',true).maybeSingle();
  if(error||!data)return {...fallback,oficial:false,imagenesOficiales:false};
  const sede=data as SedePublica;
  const {data:imagenes,error:imagesError}=await db.from('imagenes')
   .select('url_publica,texto_alternativo,titulo,destacada')
   .eq('sede_id',sede.id).eq('publicada',true)
   .order('orden',{ascending:true}).order('id',{ascending:true});
  const fotos=imagesError?[]:(imagenes??[]) as ImagenPublica[];
  let rooms:PublicRoom[]=[];
  if(sede.tipo==='hotel'){
   // Nunca leer habitaciones físicas. Solo tipos publicados para este hotel.
   const {data:tipos,error:typesError}=await db.from('tipos_habitacion')
    .select('id,nombre,descripcion_corta,descripcion_detallada,capacidad_personas,cantidad_camas,tipo_cama,precio_desde,imagen_principal,comodidades')
    .eq('sede_id',sede.id).eq('publicado',true)
    .order('orden',{ascending:true}).order('id',{ascending:true});
   if(!typesError){
    const publishedTypes=(tipos??[]) as TipoHabitacionPublica[];
    let roomPhotos:{tipo_habitacion_id:number;url_publica:string;texto_alternativo:string|null;titulo:string|null;destacada:boolean}[]=[];
    if(publishedTypes.length){
     const {data:roomImages,error:roomImagesError}=await db.from('imagenes')
      .select('tipo_habitacion_id,url_publica,texto_alternativo,titulo,destacada')
      .in('tipo_habitacion_id',publishedTypes.map(t=>t.id))
      .is('sede_id',null).eq('publicada',true)
      .order('orden',{ascending:true}).order('id',{ascending:true});
     if(!roomImagesError)roomPhotos=roomImages??[];
    }
    rooms=publishedTypes.map(t=>({
     id:t.id,nombre:t.nombre,descripcion:t.descripcion_corta||t.descripcion_detallada||'',descripcionDetallada:t.descripcion_detallada||'',
     capacidad:t.capacidad_personas,camas:t.cantidad_camas,tipoCama:t.tipo_cama,
     precioDesde:t.precio_desde===null?null:Number(t.precio_desde),
     comodidades:t.comodidades??[],
     imagen:t.imagen_principal||roomPhotos.find(p=>p.tipo_habitacion_id===t.id&&p.destacada)?.url_publica||roomPhotos.find(p=>p.tipo_habitacion_id===t.id)?.url_publica||null,
     fotos:roomPhotos.filter(p=>p.tipo_habitacion_id===t.id).map(p=>({src:p.url_publica,alt:p.texto_alternativo||p.titulo||t.nombre})),
    }));
   }
  }
  const galleryItems=fotos.map(img=>({src:img.url_publica,alt:img.texto_alternativo||img.titulo||`Fotografía de ${sede.nombre}`}));
  const hero=sede.imagen_principal||fotos.find(f=>f.destacada)?.url_publica||fotos[0]?.url_publica||fallback.hero;
  return {
   ...fallback,name:sede.nombre,introduction:sede.descripcion||fallback.introduction,
   location:sede.direccion||fallback.location,hero,
   gallery:galleryItems.length?galleryItems.map(f=>f.src):fallback.gallery,
   galleryItems:galleryItems.length?galleryItems:undefined,
   sedeId:sede.id,googleRating:sede.google_rating==null?null:Number(sede.google_rating),googleReviewsCount:sede.google_reviews_count,googleReviewsCheckedAt:sede.google_reviews_checked_at,
   oficial:true,imagenesOficiales:galleryItems.length>0,
   heroOficial:Boolean(sede.imagen_principal||fotos.length),rooms,
   direccion:sede.direccion||undefined,telefono:sede.telefono||undefined,
   telefonosAdicionales:(sede.telefonos_adicionales??[]).filter(Boolean),
   googleMapsUrl:sede.google_maps_url||undefined,
   whatsapp:sede.whatsapp||undefined,email:sede.email||undefined,
  };
 }catch{
  // Si Supabase está temporalmente indisponible, conservamos la maqueta
  // sin mostrar datos privados de las sedes.
  return {...fallback,oficial:false,imagenesOficiales:false};
 }
}

export async function getPublicVenues(){
 const [coban,antigua,restaurante,eventos]=await Promise.all([
  getPublicVenue('coban'),getPublicVenue('antigua'),getPublicVenue('restaurante'),getPublicVenue('eventos'),
 ]);
 return {coban,antigua,restaurante,eventos};
}
