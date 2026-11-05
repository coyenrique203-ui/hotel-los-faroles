import Link from 'next/link';
import {AdminShell} from '@/components/admin/admin-shell';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedesForAdmin} from '@/lib/admin/sedes';
import {getEventActivities} from '@/lib/event-activities';
import {createActivity,changeActivity} from './actions';
import '@/styles/experiencias.css';
import {CreateEstablishment} from '@/components/admin/sedes/create-establishment';

export default async function EventosAdmin({searchParams}:{searchParams:Promise<{sede?:string;status?:string}>}){
 const admin=await requireAdmin();const {sede:raw,status}=await searchParams;
 const sedes=(await getSedesForAdmin(admin)).filter(s=>s.tipo==='eventos');
 const sede=sedes.find(s=>s.id===Number(raw))??sedes[0];
 const activities=sede?await getEventActivities(sede.id):[];
 return <AdminShell adminName={admin.nombre} adminRole={admin.rol}><div className="admin-page-head"><span>INICIO / EVENTOS</span><h1>Eventos y celebraciones</h1><p>Administra distintos salones de eventos, cada uno con sus datos, fotografías, WhatsApp y actividades realizadas.</p></div>
 <CreateEstablishment kind="eventos" canCreate={admin.rol==='general'} status={status}/>
 {status==='created'&&<p className="experience-alert success">Actividad y fotografías guardadas correctamente.</p>}
 {status==='saved'&&<p className="experience-alert success">Se actualizaron los datos de la actividad.</p>}
 {['invalid','error','r2','config','denegado'].includes(status??'')&&<p className="experience-alert error">{status==='config'?'Revisa las variables de R2.':status==='r2'?'No fue posible subir las fotos a R2.':'No se pudo guardar. Revisa los datos, permisos y el SQL 04.'}</p>}
 {!sede?<div className="admin-card experience-empty"><h2>Sin salones asignados</h2><p>Crea un nuevo salón de eventos desde este módulo o pide al administrador general que te asigne uno.</p><span>Gestiona todos los salones desde Eventos.</span></div>:<>
 <div className="experience-switcher">{sedes.map(s=><Link key={s.id} className={s.id===sede.id?'selected':''} href={'/admin/eventos?sede='+s.id}>{s.nombre}</Link>)}</div>
 <div className="experience-admin-cards"><article className="experience-admin-card"><div><span>DATOS DEL SALÓN · {sede.publicado?'PUBLICADO':'BORRADOR'}</span><h2>{sede.nombre}</h2><p>WhatsApp: {sede.whatsapp||'Pendiente'} · {sede.direccion||'Dirección pendiente'}</p></div><div className="experience-admin-links"><Link href={'/admin/eventos/'+sede.id}>Información y contacto</Link><Link href={'/admin/eventos/'+sede.id+'?tab=fotos'}>Fotografías de las instalaciones</Link><Link href={'/sedes/'+sede.slug} target="_blank">Vista pública ↗</Link></div></article></div>
 <section className="admin-card experience-section"><div className="admin-card-head"><h2>Publicar una actividad realizada</h2><p>Ejemplo: una celebración de quince años, una boda o una conferencia. Sube hasta ocho fotografías JPG, PNG o WebP (máximo 8 MB cada una).</p></div>
 <form className="experience-admin-form" action={createActivity}><input type="hidden" name="sede_id" value={sede.id}/><label>Título del evento<input name="titulo" minLength={3} maxLength={160} required placeholder="Ej. Una noche de quince años inolvidable"/></label><label>Fecha de la actividad<input type="date" name="fecha_evento"/></label><label>Breve descripción<textarea name="descripcion" maxLength={1600} rows={4} placeholder="Una hermosa celebración en nuestros espacios..."/></label><label>Fotografías<input name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple required/></label><label className="experience-inline"><input name="publicado" type="checkbox"/> Publicar en la página del salón</label><small>Publica solo fotografías para las que tengas autorización de las personas que aparecen en ellas.</small><button type="submit">Guardar actividad</button></form></section>
 <section className="admin-card experience-section"><div className="admin-card-head"><h2>Actividades registradas</h2><p>{activities.length} actividad{activities.length===1?'':'es'} en este salón.</p></div>
 {!activities.length?<p className="experience-empty-copy">Aún no hay actividades. Registra la primera cuando tengas fotografías autorizadas.</p>:<div className="experience-activity-admin-list">{activities.map(a=><div className="experience-activity-admin-item" key={a.id}><div>{a.fotos[0]&&<div className="experience-thumbnail" style={{backgroundImage:'url("'+a.fotos[0].url_publica+'")'}}/>}<div><h3>{a.titulo}</h3><p>{a.fecha_evento||'Sin fecha'} · {a.fotos.length} foto{a.fotos.length===1?'':'s'} · {a.publicado?'Visible':'Borrador'}</p></div></div><form action={changeActivity}><input type="hidden" name="sede_id" value={sede.id}/><input type="hidden" name="id" value={a.id}/><button type="submit" name="accion" value={a.publicado?'hide':'publish'}>{a.publicado?'Ocultar':'Publicar'}</button><button type="submit" className="experience-danger" name="accion" value="delete">Eliminar</button></form></div>)}</div>}</section>
 </>}</AdminShell>;
}
