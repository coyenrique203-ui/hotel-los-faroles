import type {Sede} from '@/lib/admin/sedes';
import {updateSedeAction} from '@/app/admin/sedes/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';

function Field({label,name,value,type='text',hint}:{label:string;name:string;value:string|null;type?:string;hint?:string}){
 return <label className="sede-field"><span>{label}</span><input type={type} name={name} defaultValue={value??''} maxLength={name==='email'?254:300} placeholder={hint??''}/></label>;
}
export function SedeForm({sede}:{sede:Sede}){
 return <form action={updateSedeAction} className="sede-editor"><input type="hidden" name="id" value={sede.id}/>
 <section className="admin-card"><div className="admin-card-head"><h2>Información general</h2><p>Nombre comercial y presentación del establecimiento</p></div><div className="sede-form-inner"><div className="sede-form-grid"><Field label="Nombre de la sede" name="nombre" value={sede.nombre}/><div className="sede-field"><span>Tipo de establecimiento</span><div className="sede-readonly">{sede.tipo==='hotel'?'Hotel':sede.tipo==='restaurante'?'Restaurante':'Salón de eventos'}</div></div></div><label className="sede-field"><span>Descripción</span><textarea name="descripcion" defaultValue={sede.descripcion??''} rows={5} maxLength={3000} placeholder="Describe la experiencia de esta sede..."/></label></div></section>
 <section className="admin-card"><div className="admin-card-head"><h2>Ubicación y contacto</h2><p>Dirección, indicaciones y teléfonos de atención para los visitantes</p></div><div className="sede-form-inner">
  <label className="sede-field"><span>Dirección escrita</span><textarea name="direccion" defaultValue={sede.direccion??''} rows={2} maxLength={500} placeholder="Ej. 2a Calle 3-61, Cobán, Alta Verapaz"/><small className="sede-field-hint">Esta dirección se mostrará como texto en la página de la sede.</small></label>
  <label className="sede-field"><span>Ubicación en Google Maps</span><input type="url" name="google_maps_url" defaultValue={sede.google_maps_url??''} maxLength={2000} placeholder="https://maps.app.goo.gl/..."/><small className="sede-field-hint">Abre Google Maps, selecciona la ubicación exacta, pulsa «Compartir» y copia el enlace. El botón «Cómo llegar» abrirá esa ubicación.</small>{sede.google_maps_url&&<a className="sede-maps-preview" href={sede.google_maps_url} target="_blank" rel="noopener noreferrer">Comprobar ubicación en Google Maps ↗</a>}</label>
  <div className="sede-contact-group"><strong>Teléfonos de atención</strong><p>El principal se muestra directamente en la página. Puedes agregar hasta dos números más.</p><div className="sede-form-grid"><Field label="Teléfono principal" name="telefono" value={sede.telefono} hint="+502 7951-1140"/><Field label="Teléfono adicional 1 (opcional)" name="telefono_2" value={sede.telefonos_adicionales?.[0]??null} hint="+502 ..."/><Field label="Teléfono adicional 2 (opcional)" name="telefono_3" value={sede.telefonos_adicionales?.[1]??null} hint="+502 ..."/></div></div>
  <div className="sede-form-grid"><Field label="WhatsApp" name="whatsapp" value={sede.whatsapp} hint="502XXXXXXXX"/><Field label="Correo electrónico" name="email" value={sede.email} type="email"/></div>
 </div></section>
 <section className="admin-card"><div className="admin-card-head"><h2>Publicación de la sede</h2><p>Controla si los visitantes pueden consultar este establecimiento.</p></div><div className="sede-form-inner"><label className="sede-publication"><input type="checkbox" name="publicado" defaultChecked={sede.publicado}/><span><strong>Publicar esta sede</strong><small>Al activarlo, sus datos quedan disponibles para la web pública. Desmárcalo para mantenerla en borrador.</small></span></label></div></section>
 <div className="sede-actions"><FormSubmitButton pendingText="Guardando cambios...">Guardar cambios</FormSubmitButton><span>Identificador: {sede.slug} · #{sede.id}</span></div>
 </form>
}
