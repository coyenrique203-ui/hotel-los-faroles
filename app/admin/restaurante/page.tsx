import Link from 'next/link';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import '@/styles/experiencias.css';
import {CreateEstablishment} from '@/components/admin/sedes/create-establishment';

export default async function RestauranteAdmin({searchParams}:{searchParams:Promise<{status?:string}>}){
 const admin=await requireAdmin();
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='restaurante');
 const {status}=await searchParams;
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}><div className="admin-page-head"><span>INICIO / RESTAURANTE</span><h1>Ambiente y experiencias</h1><p>Organiza todos tus restaurantes por ubicación. Cada uno tiene su propia información, fotografías y número de WhatsApp.</p></div>
 <CreateEstablishment kind="restaurante" canCreate={admin.rol==='general'} status={status}/>
 {!sedes.length?<div className="admin-card experience-empty"><h2>Aún no hay restaurantes asignados</h2><p>Crea tu primer restaurante aquí o solicita acceso al administrador general.</p><span>Los nuevos establecimientos se crean desde este módulo.</span></div>:<div className="experience-admin-cards">{sedes.map(s=><article className="experience-admin-card" key={s.id}><div><span>RESTAURANTE · {s.publicado?'PUBLICADO':'BORRADOR'}</span><h2>{s.nombre}</h2><p>{s.descripcion||'Agrega una presentación del restaurante y sus instalaciones.'}</p><p className="experience-admin-meta">WhatsApp: {s.whatsapp||'Pendiente de configurar'} · {s.direccion||'Ubicación pendiente'}</p></div><div className="experience-admin-links"><Link href={'/admin/restaurante/'+s.id}>Administrar restaurante</Link><Link href={'/admin/restaurante/'+s.id+'?tab=fotos'}>Fotografías</Link><Link href={'/sedes/'+s.slug} target="_blank">Vista pública ↗</Link></div></article>)}</div>}
 <div className="admin-card experience-help"><h2>¿Qué puedes mostrar aquí?</h2><p>Fotografías de mesas, espacios, platillos y ambiente. Los datos y fotos se administran desde cada sede; no necesitas registrar un menú ni precios. Al pulsar «Consultar mesa», el visitante indicará nombre, fecha, hora y personas antes de abrir WhatsApp.</p></div></AdminShell>;
}
