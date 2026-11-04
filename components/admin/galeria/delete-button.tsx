'use client';
import {useFormStatus} from 'react-dom';
export function DeleteButton(){const {pending}=useFormStatus();return <button type="submit" name="operacion" value="eliminar" className="gallery-delete" disabled={pending} aria-busy={pending} onClick={event=>{if(!window.confirm('¿Eliminar esta fotografía definitivamente? Esta acción también borrará el archivo de R2.'))event.preventDefault();}}>{pending?<><span className="admin-loading-spinner" aria-hidden="true"/> Procesando...</>:'Eliminar'}</button>}
