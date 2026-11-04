'use client';
import {useState} from 'react';
import {X} from 'lucide-react';
export function DemoAction({children,className=''}:{children:React.ReactNode;className?:string}){
  const [visible,setVisible]=useState(false);
  return <><button className={className} type="button" onClick={()=>setVisible(true)}>{children}</button>{visible&&<div className="toast" role="status"><div><strong>Vista de demostración</strong><p>La función se activará cuando conectemos el panel y el sistema de reservas. Todavía no se envían solicitudes.</p></div><button onClick={()=>setVisible(false)} aria-label="Cerrar aviso"><X size={18}/></button></div>}</>;
}
