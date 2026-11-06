import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {notFound} from 'next/navigation';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedeForAdmin} from '@/lib/admin/sedes';
import {AdminShell} from '@/components/admin/admin-shell';
import {SedeForm} from './sede-form';
import {getGaleria} from '@/lib/admin/galeria';
import {SedePhotos} from './sede-photos';
import {SedeTabs} from './sede-tabs';
import {getReservaAdminData} from '@/lib/admin/reservaciones';
import {SedeReservaciones} from './sede-reservaciones';
import {EventActivitiesAdmin} from '@/components/admin/eventos/event-activities-admin';

export async function EstablishmentEditor({id,kind,status,tab}:{id:number;kind:'hotel'|'restaurante'|'eventos';status?:string;tab?:string}){
 if(!Number.isSafeInteger(id)||id<1)notFound();
 const admin=await requireAdmin();
 const sede=await getSedeForAdmin(admin,id);
 if(!sede||sede.tipo!==kind)notFound();
 const [{imagenes},reservasData]=await Promise.all([
  getGaleria(admin,id),
  kind==='hotel'?getReservaAdminData(id,true):Promise.resolve(null),
 ]);
 const parent=kind==='hotel'?'/admin/sedes':kind==='restaurante'?'/admin/restaurante':'/admin/eventos';
 const label=kind==='hotel'?'HOTELES':kind==='restaurante'?'RESTAURANTES':'SALONES DE EVENTOS';
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}><div className="admin-page-head"><Link className="sede-back" href={parent}><ArrowLeft size={16}/> VOLVER A {label}</Link><h1>Editar {sede.nombre}</h1><p>Gestiona información, ubicación, WhatsApp e imágenes de este establecimiento.</p></div>
 <SedeTabs initialTab={tab==='fotos'?'fotos':kind==='hotel'&&tab==='reservas'?'reservas':kind==='eventos'&&tab==='actividades'?'actividades':'info'} photoCount={imagenes.length} info={<>
 {status==='ok'&&<div className="sede-success" role="status">Información guardada correctamente.</div>}
 {tab!=='fotos'&&status==='error'&&<div className="sede-error" role="alert">No fue posible guardar los cambios. Revisa los campos.</div>}
 {tab!=='fotos'&&status==='denegado'&&<div className="sede-error" role="alert">No tienes permisos para modificar este establecimiento.</div>}
 <SedeForm sede={sede}/></>} photos={<SedePhotos sede={sede} imagenes={imagenes} status={tab==='fotos'?status:undefined} social={kind!=='hotel'}/>}
 activities={kind==='eventos'?<EventActivitiesAdmin sede={sede} status={tab==='actividades'?status:undefined}/>:undefined}
 reservas={kind==='hotel'&&reservasData?<SedeReservaciones sede={sede} config={reservasData.config} status={tab==='reservas'?status:undefined}/>:undefined}/></AdminShell>;
}
