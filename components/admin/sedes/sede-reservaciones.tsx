import type {Sede} from '@/lib/admin/sedes';
import type {ReservaConfig} from '@/lib/admin/reservaciones';
import {saveReservasSede} from '@/app/admin/sedes/reservaciones-actions';
import {FormSubmitButton} from '@/components/admin/shared/form-submit-button';
import '@/styles/sede-reservaciones.css';
import {BookingEngineUrlField} from './booking-engine-url-field';

export function SedeReservaciones({sede,config,status}:{sede:Sede;config:ReservaConfig|null;status?:string}){
 return <section className="admin-card sede-reservas-card">
  <header className="admin-card-head"><span className="reservas-eyebrow">RESERVAS · {sede.nombre.toUpperCase()}</span><h2>¿Cómo recibir las reservaciones?</h2><p>Configura el canal de contacto de este establecimiento. Cada sede puede utilizar uno diferente.</p></header>
  {status==='ok'&&<p className="sede-success" role="status">La configuración de reservaciones se guardó correctamente.</p>}
  {status==='invalid'&&<p className="sede-error" role="alert">Revisa el número de WhatsApp y los enlaces HTTPS.</p>}
  {status==='error'&&<p className="sede-error" role="alert">No se pudieron guardar todos los datos. Verifica SQL 08 e inténtalo de nuevo.</p>}
  {status==='denegado'&&<p className="sede-error" role="alert">No tienes permiso para editar esta sede.</p>}
  <form action={saveReservasSede} className="sede-reservas-form"><input type="hidden" name="sede_id" value={sede.id}/>
   <div className="reserva-methods">
    <label><input type="radio" name="metodo" value="whatsapp" defaultChecked={(config?.metodo??'whatsapp')==='whatsapp'}/><span><strong>Por WhatsApp</strong><small>El visitante escribirá directamente al establecimiento con un mensaje preparado.</small></span></label>
    <label><input type="radio" name="metodo" value="externo" defaultChecked={config?.metodo==='externo'}/><span><strong>Sistema externo</strong><small>El visitante elegirá fechas y personas antes de entrar al motor de reservas del hotel.</small></span></label>
   </div>
   <div className="sede-form-grid">
    <label className="sede-field"><span>Número de WhatsApp</span><input name="whatsapp_numero" defaultValue={config?.whatsapp_numero??sede.whatsapp??''} placeholder="50212345678" inputMode="tel" maxLength={30}/><small>Con código de país. Ejemplo: 50212345678.</small></label>
    <BookingEngineUrlField initialUrl={config?.url_externa??''}/>
   </div>
   <p className="reserva-message-note">El mensaje de WhatsApp se creará automáticamente con los datos que el visitante complete en el formulario de la web pública.</p>
   <div className="sede-actions"><FormSubmitButton pendingText="Guardando reservaciones...">Guardar configuración</FormSubmitButton><span>Los cambios se aplicarán a los botones de reserva de este hotel.</span></div>
  </form>
 </section>;
}
