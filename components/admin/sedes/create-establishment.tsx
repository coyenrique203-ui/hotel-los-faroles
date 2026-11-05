import {createSedeAction} from '@/app/admin/sedes/actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/sedes-dinamicas.css';

export function CreateEstablishment({kind,canCreate,status}:{kind:'restaurante'|'eventos';canCreate:boolean;status?:string}){
 const restaurant=kind==='restaurante';
 if(!canCreate)return null;
 return <>
 {status==='error'&&<div className="sede-error" role="alert">No se pudo crear el establecimiento. Verifica los permisos de Supabase.</div>}
 {status==='invalid'&&<div className="sede-error" role="alert">Revisa el nombre y el enlace de Google Maps.</div>}
 {status==='denegado'&&<div className="sede-error" role="alert">Solo el administrador general puede crear establecimientos.</div>}
 <details className="admin-card new-sede-card"><summary className="new-sede-trigger"><span>+ {restaurant?'NUEVO RESTAURANTE':'NUEVO SALÓN DE EVENTOS'}</span><small>Agregar otra ubicación con sus propios datos, fotografías y WhatsApp</small></summary>
 <form action={createSedeAction} className="new-sede-form"><input type="hidden" name="tipo" value={kind}/>
 <div className="sede-form-grid"><label className="sede-field"><span>Nombre comercial</span><input name="nombre" minLength={3} maxLength={150} required placeholder={restaurant?'Ej. Restaurante Los Faroles Antigua':'Ej. Salón Los Faroles Cobán'}/></label><label className="sede-field"><span>Dirección (opcional)</span><input name="direccion" maxLength={500} placeholder="Ciudad, departamento"/></label></div>
 <label className="sede-field"><span>Ubicación Google Maps (opcional)</span><input name="google_maps_url" type="url" maxLength={2000} placeholder="https://maps.app.goo.gl/..."/></label>
 <p>Se creará como <strong>borrador</strong>. Después podrás configurar los contactos y subir imágenes desde sus pestañas.</p>
 <FormSubmitButton pendingText="Creando establecimiento...">Crear {restaurant?'restaurante':'salón de eventos'}</FormSubmitButton>
 </form></details></>;
}
