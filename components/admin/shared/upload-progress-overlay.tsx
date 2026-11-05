'use client';
import {useFormStatus} from 'react-dom';
import {LoaderCircle,UploadCloud} from 'lucide-react';

export function UploadProgressOverlay({label='Guardando fotografías...'}:{label?:string}){
 const {pending}=useFormStatus();
 if(!pending)return null;
 return <div className="upload-processing-overlay" role="status" aria-live="polite" aria-busy="true">
  <div className="upload-processing-card"><div className="upload-processing-icon"><UploadCloud size={29}/><LoaderCircle className="upload-processing-spinner" size={48}/></div>
   <strong>{label}</strong><p>Estamos preparando y guardando tus imágenes. No cierres esta ventana.</p>
   <div className="upload-processing-track"><span/></div><small>El tiempo depende de la cantidad y el tamaño de los archivos.</small>
  </div>
 </div>;
}
