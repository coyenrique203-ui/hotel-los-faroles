import 'server-only';
import {cache} from 'react';
import {createClient} from '@supabase/supabase-js';
import {venues} from '@/lib/hotel-content';
import type {PublicVenue,PublicRoom} from '@/lib/public-content';

type Establishment={id:number;nombre:string;slug:string;tipo:string;descripcion:string|null;direccion:string|null;telefono:string|null;telefonos_adicionales:string[]|null;google_maps_url:string|null;whatsapp:string|null;email:string|null;imagen_principal:string|null};
type ImageRow={url_publica:string;texto_alternativo:string|null;titulo:string|null;destacada:boolean};
type RoomRow={id:number;nombre:string;descripcion_corta:string|null;descripcion_detallada:string|null;capacidad_personas:number;cantidad_camas:number;tipo_cama:string|null;precio_desde:number|null;imagen_principal:string|null};
type RoomImageRow={tipo_habitacion_id:number;url_publica:string;texto_alternativo:string|null;titulo:string|null;destacada:boolean};

export type EstablishmentCard={id:number;nombre:string;slug:string;tipo:'hotel'|'restaurante'|'eventos';direccion:string|null;imagen:string|null};

function db(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error('Falta configurar Supabase');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
}

/** Solo devuelve sedes publicadas y no usa la sesión del administrador. */
export const getPublishedEstablishments=cache(async ():Promise<EstablishmentCard[]>=>{
 try{
  const {data,error}=await db().from('sedes')
   .select('id,nombre,slug,tipo,direccion,imagen_principal')
   .eq('publicado',true).order('orden',{ascending:true}).order('id',{ascending:true});
  if(error)return [];
  return (data??[]).filter(s=>['hotel','restaurante','eventos'].includes(s.tipo)) as EstablishmentCard[];
 }catch{return [];}
});

export const getPublishedEstablishment=cache(async (slug:string):Promise<PublicVenue|null>=>{
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>100)return null;
 try{
  const client=db();
  const {data,error}=await client.from('sedes')
   .select('id,nombre,slug,tipo,descripcion,direccion,telefono,telefonos_adicionales,google_maps_url,whatsapp,email,imagen_principal')
   .eq('slug',slug).eq('publicado',true).maybeSingle();
  if(error||!data||!['hotel','restaurante','eventos'].includes(data.tipo))return null;
  const sede=data as Establishment;
  const base=venues[slug]??venues[sede.tipo==='hotel'?'coban':sede.tipo];
  const [galleryResult,typesResult]=await Promise.all([
   client.from('imagenes').select('url_publica,texto_alternativo,titulo,destacada')
    .eq('sede_id',sede.id).eq('publicada',true)
    .order('orden',{ascending:true}).order('id',{ascending:true}),
   sede.tipo==='hotel'?client.from('tipos_habitacion')
    .select('id,nombre,descripcion_corta,descripcion_detallada,capacidad_personas,cantidad_camas,tipo_cama,precio_desde,imagen_principal')
    .eq('sede_id',sede.id).eq('publicado',true)
    .order('orden',{ascending:true}).order('id',{ascending:true}):Promise.resolve(null),
  ]);
  const images=galleryResult.error?[]:(galleryResult.data??[]) as ImageRow[];
  const publicTypes=typesResult&&!typesResult.error?(typesResult.data??[]) as RoomRow[]:[];
  let roomImages:RoomImageRow[]=[];
  if(publicTypes.length){
   const {data:photos,error:photosError}=await client.from('imagenes')
    .select('tipo_habitacion_id,url_publica,texto_alternativo,titulo,destacada')
    .in('tipo_habitacion_id',publicTypes.map(t=>t.id))
    .is('sede_id',null).eq('publicada',true)
    .order('orden',{ascending:true}).order('id',{ascending:true});
   if(!photosError)roomImages=(photos??[]) as RoomImageRow[];
  }
  const rooms:PublicRoom[]=publicTypes.map(type=>{
   const pictures=roomImages.filter(photo=>photo.tipo_habitacion_id===type.id);
   return {
    id:type.id,nombre:type.nombre,descripcion:type.descripcion_corta||type.descripcion_detallada||'',
    capacidad:type.capacidad_personas,camas:type.cantidad_camas,tipoCama:type.tipo_cama,
    precioDesde:type.precio_desde===null?null:Number(type.precio_desde),
    imagen:type.imagen_principal||pictures.find(photo=>photo.destacada)?.url_publica||pictures[0]?.url_publica||null,
    fotos:pictures.map(photo=>({src:photo.url_publica,alt:photo.texto_alternativo||photo.titulo||type.nombre})),
   };
  });
  const galleryItems=images.map(image=>({src:image.url_publica,alt:image.texto_alternativo||image.titulo||sede.nombre}));
  const image=sede.imagen_principal||images.find(item=>item.destacada)?.url_publica||images[0]?.url_publica;
  return {
   ...base,slug:sede.slug,name:sede.nombre,
   type:sede.tipo==='hotel'?'hotel':sede.tipo==='restaurante'?'restaurant':'events',
   tagline:base.tagline,introduction:sede.descripcion||base.introduction,
   location:sede.direccion||'Ubicación por confirmar',hero:image||base.hero,
   gallery:galleryItems.length?galleryItems.map(item=>item.src):base.gallery,
   galleryItems:galleryItems.length?galleryItems:undefined,
   oficial:true,imagenesOficiales:galleryItems.length>0,heroOficial:Boolean(image),
   rooms,direccion:sede.direccion||undefined,telefono:sede.telefono||undefined,
   telefonosAdicionales:(sede.telefonos_adicionales??[]).filter(Boolean),
   googleMapsUrl:sede.google_maps_url||undefined,whatsapp:sede.whatsapp||undefined,email:sede.email||undefined,
  };
 }catch{return null;}
});
