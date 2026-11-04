import Link from 'next/link';
import {ArrowUpRight, BedDouble, Building2, Camera, Plus, Users, Bed, CheckCircle2} from 'lucide-react';
import type {Sede} from '@/lib/admin/sedes';
import type {RoomType} from '@/lib/admin/habitaciones';
import {saveRoomType} from '@/app/admin/habitaciones/actions';
import {RoomAmenitiesEditor} from './room-amenities-editor';

const messages:Record<string,string>={
 saved:'El tipo de habitación se guardó correctamente.',
 saveerror:'No se pudo guardar. Revisa los datos y los permisos de Supabase.',
 invalid:'Revisa el nombre, identificador, capacidad, camas y precio.',
 denegado:'No tienes acceso a esta sede.',
};

function Field({label,name,value='',type='text',required=false,hint,placeholder,min,max}:{label:string;name:string;value?:string|number|null;type?:string;required?:boolean;hint?:string;placeholder?:string;min?:number;max?:number}){
 return <label className="sede-field"><span>{label}{required?' *':''}</span><input name={name} type={type} defaultValue={value??''} required={required} placeholder={placeholder} min={min} max={max} step={name==='precio_desde'?'0.01':undefined}/>{hint&&<small className="sede-field-hint">{hint}</small>}</label>;
}

export function RoomAdmin({sedes,selected,tipos,status,tipoId}:{sedes:Sede[];selected:Sede|null;tipos:RoomType[];status?:string;tipoId?:number}){
 const tipo=tipos.find(t=>t.id===tipoId);
 return <>
  <div className="admin-page-head"><span>INICIO / ALOJAMIENTOS</span><h1>Tipos de habitación</h1><p>Presenta las opciones de alojamiento que ofrece cada hotel. No necesitas registrar cada habitación física.</p></div>
  {status&&messages[status]&&<div className={status==='saved'?'sede-success':'sede-error'} role="status">{messages[status]}</div>}
  <div className="admin-card room-hotel-selector"><div className="admin-card-head"><h2>Hotel</h2><p>Las habitaciones y fotografías se organizan por sede.</p></div><div className="gallery-venue-tabs">{sedes.map(s=><Link className={selected?.id===s.id?'active':''} href={`/admin/habitaciones?sede=${s.id}`} key={s.id}><Building2 size={14}/> {s.nombre}</Link>)}</div></div>
  {!selected?<div className="admin-card"><div className="gallery-empty">No hay hoteles asignados a tu usuario.</div></div>:<>
   <div className="admin-card"><div className="admin-card-head room-head-row"><div><h2>Habitaciones de {selected.nombre}</h2><p>{tipos.length} {tipos.length===1?'tipo registrado':'tipos registrados'} · {tipos.filter(t=>t.publicado).length} publicados</p></div><Link className="room-add" href={`/admin/habitaciones?sede=${selected.id}#form-tipo`}><Plus size={16}/> Nuevo tipo</Link></div>
    <div className="room-admin-grid">{tipos.length?tipos.map(t=><article key={t.id} className="room-admin-card"><Link className="room-admin-card-main" href={`/admin/habitaciones?sede=${selected.id}&tipo=${t.id}#form-tipo`}>{t.imagen_principal?<img className="room-admin-thumbnail" src={t.imagen_principal} alt={t.nombre}/>:<div className="room-empty-photo"><BedDouble size={30}/></div>}<div className="room-admin-card-body"><span className={t.publicado?'room-published-badge':'room-draft-badge'}>{t.publicado?'PUBLICADO':'BORRADOR'}</span><h3>{t.nombre}</h3><p className="room-admin-card-meta"><Users size={14}/> Hasta {t.capacidad_personas} personas <span>·</span> <Bed size={14}/> {t.cantidad_camas} {t.cantidad_camas===1?'cama':'camas'}</p>{t.precio_desde!==null&&<strong>Desde Q{Number(t.precio_desde).toFixed(2)}</strong>}<span className="room-edit-link">Editar información <ArrowUpRight size={14}/></span></div></Link><Link className="room-manage-photos" href={`/admin/habitaciones/${t.id}/galeria`}><Camera size={16}/> Administrar fotografías <ArrowUpRight size={14}/></Link></article>):<div className="room-empty-state"><BedDouble size={32}/><h3>Agrega tu primer tipo de habitación</h3><p>Por ejemplo, Habitación Estándar, Suite o Habitación Familiar.</p><a href="#form-tipo">Crear habitación</a></div>}</div>
   </div>
   <div className="admin-card" id="form-tipo"><div className="admin-card-head"><h2>{tipo?`Editar ${tipo.nombre}`:'Nuevo tipo de habitación'}</h2><p>Completa únicamente la información que verá el huésped. Las fotos se agregan desde la galería al guardar.</p></div>
    <form key={tipo?.id??'nuevo'} action={saveRoomType} className="room-admin-form"><input type="hidden" name="sede_id" value={selected.id}/><input type="hidden" name="id" value={tipo?.id??''}/>
     <section className="room-form-section"><div className="room-form-section-title"><span>01</span><div><h3>Información principal</h3><p>Nombre y descripción del alojamiento.</p></div></div><div className="sede-form-grid"><Field label="Nombre del tipo" name="nombre" value={tipo?.nombre} required placeholder="Ej. Suite Familiar"/><Field label="Identificador" name="slug" value={tipo?.slug} required placeholder="suite-familiar" hint="Solo letras minúsculas, números y guiones. Debe ser único en este hotel."/></div><label className="sede-field"><span>Descripción breve</span><textarea name="descripcion_corta" rows={2} defaultValue={tipo?.descripcion_corta??''} maxLength={1000} placeholder="Una descripción atractiva para presentar esta habitación."/></label><label className="sede-field"><span>Descripción completa</span><textarea name="descripcion_detallada" rows={4} defaultValue={tipo?.descripcion_detallada??''} maxLength={5000} placeholder="Describe los espacios, las camas, las vistas y la experiencia de hospedaje."/></label></section>
     <section className="room-form-section"><div className="room-form-section-title"><span>02</span><div><h3>Capacidad y camas</h3><p>Información visible en la tarjeta de la habitación.</p></div></div><div className="sede-form-grid"><Field label="Capacidad máxima de huéspedes" name="capacidad_personas" value={tipo?.capacidad_personas??2} type="number" min={1} max={50} required/><Field label="Cantidad de camas" name="cantidad_camas" value={tipo?.cantidad_camas??1} type="number" min={1} max={30} required/><Field label="Tipo de cama" name="tipo_cama" value={tipo?.tipo_cama} placeholder="Ej. 1 king o 2 matrimoniales"/><Field label="Precio de referencia (Q)" name="precio_desde" value={tipo?.precio_desde} type="number" min={0} hint="Opcional. No representa disponibilidad ni confirma una reserva."/></div></section>
     <section className="room-form-section"><div className="room-form-section-title"><span>03</span><div><h3>Servicios y comodidades</h3><p>Selecciona lo que incluye este tipo de habitación.</p></div></div><RoomAmenitiesEditor key={tipo?.id??'nuevo'} selected={tipo?.comodidades??[]}/></section>
     <section className="room-form-section"><div className="room-form-section-title"><span>04</span><div><h3>Fotografías y publicación</h3><p>La galería permite subir varias imágenes y elegir la principal.</p></div></div>{tipo?<Link className="room-photos-shortcut" href={`/admin/habitaciones/${tipo.id}/galeria`}><Camera size={20}/><span><strong>Administrar fotografías</strong><small>Subir, ordenar, publicar y seleccionar la imagen principal.</small></span><ArrowUpRight size={17}/></Link>:<p className="room-new-photos-hint"><Camera size={18}/> Después de crear el tipo podrás subir sus fotografías desde la tarjeta de arriba.</p>}<input type="hidden" name="imagen_principal" value={tipo?.imagen_principal??''}/><label className="sede-publication"><input type="checkbox" name="publicado" defaultChecked={tipo?.publicado??false}/><span><strong>Mostrar este tipo de habitación en el sitio web</strong><small>Solo será visible si la sede también está publicada.</small></span></label></section>
     <div className="room-form-actions"><button type="submit"><CheckCircle2 size={17}/>{tipo?'Guardar cambios':'Crear tipo de habitación'}</button>{tipo&&<Link href={`/admin/habitaciones?sede=${selected.id}#form-tipo`}>Cancelar edición</Link>}</div>
    </form>
   </div>
  </>}
 </>;
}
