import {notFound} from 'next/navigation';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getRoomGallery} from '@/lib/admin/galeria-habitaciones';
import {RoomPhotoGallery} from '@/components/admin/habitaciones/room-photo-gallery';

export default async function RoomGalleryPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{status?:string}>}){
 const admin=await requireAdmin();
 const {id}=await params;
 const typeId=Number(id);
 if(!Number.isSafeInteger(typeId)||typeId<1)notFound();
 const gallery=await getRoomGallery(admin,typeId);
 if(!gallery)notFound();
 const {status}=await searchParams;
 return <AdminShell adminName={admin.nombre}><RoomPhotoGallery {...gallery} status={status}/></AdminShell>;
}
