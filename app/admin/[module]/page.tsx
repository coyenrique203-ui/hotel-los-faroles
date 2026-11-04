import {notFound} from 'next/navigation';
import {adminModules} from '@/lib/admin-modules';
import {AdminModule} from '@/components/admin/admin-widgets';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {AdminSedes} from '@/components/admin/sedes/admin-sedes';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {GalleryAdmin} from '@/components/admin/galeria/gallery-admin';
import {getGaleria} from '@/lib/admin/galeria';
import {RoomAdmin} from '@/components/admin/habitaciones/room-admin';
import {getRoomAdminData} from '@/lib/admin/habitaciones';
import {getHomeCover} from '@/lib/portada-principal';
import {PortadaAdmin} from '@/components/admin/portada/portada-admin';
import {redirect} from 'next/navigation';
import {ReviewAdmin} from '@/components/admin/resenas/review-admin';
import {UsersAdmin} from '@/components/admin/usuarios/users-admin';
export default async function AdminModulePage({params,searchParams}:{params:Promise<{module:string}>;searchParams:Promise<{sede?:string;status?:string;tipo?:string}>}){
 const admin=await requireAdmin();const {module}=await params;if(!adminModules.some(m=>m.slug===module))notFound();
 if((module==='usuarios'||module==='portada')&&admin.rol!=='general')redirect('/admin');
 let content:React.ReactNode=<AdminModule slug={module}/>;
 if(module==='usuarios')content=<UsersAdmin/>;
 if(module==='portada'){
  if(admin.rol!=='general')redirect('/admin');
  const {status}=await searchParams;
  content=<PortadaAdmin cover={await getHomeCover()} status={status}/>;
 }
 if(module==='sedes'){
  const {status}=await searchParams;
  content=<AdminSedes sedes={await getSedesForAdmin(admin)} canCreate={admin.rol==='general'} status={status}/>;
 }
 if(module==='galeria'){
  const {sede,status}=await searchParams;
  const sedes=await getSedesForAdmin(admin);
  const selectedId=sede?Number(sede):(sedes[0]?.id??0);
  const result=selectedId?await getGaleria(admin,selectedId,sedes):null;
  content=<GalleryAdmin sedes={sedes} selected={sedes.find(s=>s.id===selectedId)??null} imagenes={result?.imagenes??[]} status={status}/>;
 }
 if(module==='resenas'){
  const {sede}=await searchParams;
  content=<ReviewAdmin admin={admin} sedeId={sede?Number(sede):undefined}/>;
 }
 if(module==='habitaciones'){
  const {sede,status,tipo}=await searchParams;
  const data=await getRoomAdminData(admin,sede?Number(sede):undefined);
  content=<RoomAdmin {...data} status={status} tipoId={tipo?Number(tipo):undefined}/>;
 }
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}>{content}</AdminShell>;
}
