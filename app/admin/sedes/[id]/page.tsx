import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedeForAdmin} from '@/lib/admin/sedes';
import {AdminShell} from '@/components/admin/admin-shell';
import {SedeForm} from '@/components/admin/sedes/sede-form';
import {getGaleria} from '@/lib/admin/galeria';
import {SedePhotos} from '@/components/admin/sedes/sede-photos';
import {SedeTabs} from '@/components/admin/sedes/sede-tabs';
import {getReservaAdminData} from '@/lib/admin/reservaciones';
import {SedeReservaciones} from '@/components/admin/sedes/sede-reservaciones';

export default async function SedeDetailPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{status?:string;tab?:string}>}){
 const admin=await requireAdmin();const {id}=await params;const numericId=Number(id);
 if(!Number.isSafeInteger(numericId)||numericId<1)notFound();
 const sede=await getSedeForAdmin(admin,numericId);if(!sede)notFound();
 const [{imagenes},reservasData]=await Promise.all([getGaleria(admin,numericId),getReservaAdminData(numericId,sede.tipo==='hotel')]);
 const {status,tab}=await searchParams;
 return <AdminShell adminName={admin.nombre}><div className="admin-page-head"><Link className="sede-back" href="/admin/sedes"><ArrowLeft size={16}/> VOLVER A SEDES</Link><h1>Editar {sede.nombre}</h1><p>Actualiza su información pública. Los cambios se guardan al presionar «Guardar cambios».</p></div>
 <SedeTabs initialTab={tab==='fotos'?'fotos':tab==='reservas'?'reservas':'info'} photoCount={imagenes.length} info={<>
 {status==='ok'&&<div className="sede-success" role="status">Los datos de la sede se actualizaron correctamente.</div>}
 {tab!=='fotos'&&status==='error'&&<div className="sede-error" role="alert">No fue posible guardar los cambios. Revisa los datos e inténtalo de nuevo.</div>}
 {tab!=='fotos'&&status==='denegado'&&<div className="sede-error" role="alert">Tu usuario no tiene permiso para editar esta sede.</div>}
 <SedeForm sede={sede}/></>} photos={<SedePhotos sede={sede} imagenes={imagenes} status={tab==='fotos'?status:undefined}/>} reservas={<SedeReservaciones sede={sede} config={reservasData.config} tipos={reservasData.tipos} status={tab==='reservas'?status:undefined}/>}/></AdminShell>
}
