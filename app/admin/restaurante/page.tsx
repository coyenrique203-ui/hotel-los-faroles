import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {CreateEstablishment} from '@/components/admin/sedes/create-establishment';
import {EstablishmentTiles} from '@/components/admin/sedes/establishment-tiles';

export default async function RestauranteAdmin({searchParams}:{searchParams:Promise<{status?:string}>}){
 const admin=await requireAdmin();
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='restaurante');
 const {status}=await searchParams;
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}>
 <div className="admin-page-head"><span>INICIO / RESTAURANTE</span><h1>Nuestros restaurantes</h1><p>Administra cada restaurante de forma independiente: información, teléfonos, WhatsApp y fotografías de sus espacios y ambiente.</p></div>
 <CreateEstablishment kind="restaurante" canCreate={admin.rol==='general'} status={status}/>
 <EstablishmentTiles sedes={sedes} kind="restaurante"/>
 </AdminShell>;
}
