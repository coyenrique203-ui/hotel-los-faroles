import {AdminDashboard} from '@/components/admin/admin-widgets';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
export default async function AdminPage(){const admin=await requireAdmin();return <AdminShell adminName={admin.nombre}><AdminDashboard/></AdminShell>}
