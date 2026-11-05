import {AdminDashboard} from '@/components/admin/admin-widgets';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';

export default async function AdminPage(){
 const admin=await requireAdmin();
 const sedes=await getSedesForAdmin(admin);
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}><AdminDashboard adminRole={admin.rol} sedes={sedes}/></AdminShell>;
}
