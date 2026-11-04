import type {Sede} from '@/lib/admin/sedes';
import type {ReservaConfig,ReservaTipo} from '@/lib/admin/reservaciones';
import {saveReservasSede} from '@/app/admin/sedes/reservaciones-actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/sede-reservaciones.css';

export function SedeReservaciones({sede,config,tipos,status}:{sede:Sede;config:ReservaConfig|null;tipos:ReservaTipo[];status?:string}){
 return <section className="admin-card sede-reservas-card">
  <header className="admin-card-head"><span className="reservas-eyebrow">RESERVAS · {sede.nombre.toUpperCase()}</span><h2>¿Cómo recibir las reservaciones?</h2><p>Configura el canal de contacto de este establecimiento. Cada sede puede utilizar uno diferente.</p></header>
  {status==='ok'&&<p className="sede-success" role="status">La configuración de reservaciones se guardó correctamente.</p>}
  {status==='invalid'&&<p className="sede-error" role="alert">Revisa el número de WhatsApp y los enlaces HTTPS.</p>}
  {status==='error'&&<p className="sede-error" role="alert">No se pudieron guardar todos los datos. Verifica SQL 08 e inténtalo de nuevo.</p>}
  {status==='denegado'&&<p className="sede-error" role="alert">No tienes permiso para editar esta sede.</p>}
  <form action={saveReservasSede} className="sede-reservas-form"><input type="hidden" name="sede_id" value={sede.id}/>
   <div className="reserva-methods">
    <label><input type="radio" name="metodo" value="whatsapp" defaultChecked={(config?.metodo??'whatsapp')==='whatsapp'}/><span><strong>Por WhatsApp</strong><small>El visitante escribirá directamente al establecimiento con un mensaje preparado.</small></span></label>
    <label><input type="radio" name="metodo" value="externo" defaultChecked={config?.metodo==='externo'}/><span><strong>Sistema externo</strong><small>El visitante será dirigido a la página de reservas que ya utiliza el hotel.</small></span></label>
   </div>
   <div className="sede-form-grid">
    <label className="sede-field"><span>Número de WhatsApp</span><input name="whatsapp_numero" defaultValue={config?.whatsapp_numero??sede.whatsapp??''} placeholder="50212345678" inputMode="tel" maxLength={30}/><small>Con código de país. Ejemplo: 50212345678.</small></label>
    <label className="sede-field"><span>URL del sistema externo (HTTPS)</span><input name="url_externa" type="url" defaultValue={config?.url_externa??''} placeholder="https://reservas.ejemplo.com/hotel" maxLength={2000}/><small>Utiliza la dirección oficial del proveedor.</small></label>
   </div>
   <p className="reserva-message-note">El mensaje de WhatsApp se creará automáticamente con el nombre del establecimiento, la habitación consultada y los datos que el visitante complete en el formulario de la web pública.</p>
   {sede.tipo==='hotel'&&<div className="reserva-room-links"><h3>Enlaces por tipo de habitación</h3><p>Si el sistema externo ofrece enlaces directos, coloca uno por categoría. Si se deja vacío, se usará el enlace general.</p>{tipos.length?<div className="reserva-room-fields">{tipos.map(tipo=><label className="sede-field" key={tipo.id}><span>{tipo.nombre}</span><input type="url" name={`tipo_${tipo.id}`} maxLength={2000} defaultValue={tipo.url_externa??''} placeholder="https://reservas.ejemplo.com/habitacion"/></label>)}</div>:<p>Aún no hay tipos registrados. Puedes crearlos en Habitaciones.</p>}</div>}
   <div className="sede-actions"><FormSubmitButton pendingText="Guardando reservaciones...">Guardar configuración</FormSubmitButton><span>Conectaremos los botones públicos en el siguiente paso.</span></div>
  </form>
 </section>;
}
