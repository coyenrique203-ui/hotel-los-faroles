import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {CreateEstablishment} from '@/components/admin/sedes/create-establishment';
import {EstablishmentTiles} from '@/components/admin/sedes/establishment-tiles';

export default async function EventosAdmin({searchParams}:{searchParams:Promise<{status?:string}>}){
 const admin=await requireAdmin();
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='eventos');
 const {status}=await searchParams;
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}>
 <div className="admin-page-head"><span>INICIO / EVENTOS</span><h1>Nuestros salones de eventos</h1><p>Administra cada salón independientemente. Al entrar tendrás sus pestañas de información, fotografías y actividades realizadas.</p></div>
 <CreateEstablishment kind="eventos" canCreate={admin.rol==='general'} status={status}/>
 <EstablishmentTiles sedes={sedes} kind="eventos"/>
 </AdminShell>;
}
