'use client';
import {useState} from 'react';
import {CheckCircle2,ExternalLink} from 'lucide-react';

function analyze(value:string){
 try{
  const url=new URL(value);
  const secure=url.protocol==='https:'&&!url.username&&!url.password;
  const cloudbeds=url.hostname==='hotels.cloudbeds.com'&&url.pathname.split('/').includes('reservation');
  return {secure,cloudbeds};
 }catch{return {secure:false,cloudbeds:false};}
}
export function BookingEngineUrlField({initialUrl}:{initialUrl:string}){
 const [url,setUrl]=useState(initialUrl);
 const status=analyze(url);
 return <label className="sede-field">
  <span>Enlace del motor de reservas</span>
  <input name="url_externa" type="url" value={url} onChange={event=>setUrl(event.target.value)} placeholder="https://hotels.cloudbeds.com/es/reservation/CODIGO/" maxLength={2000}/>
  <small>Pega el enlace del motor de reservas de este hotel. Puede venir con fechas de prueba: nuestra web las sustituirá por las fechas elegidas por el cliente.</small>
  {status.cloudbeds&&<small style={{display:'flex',alignItems:'center',gap:7,color:'#254e7c'}}><CheckCircle2 size={16}/> Enlace de Cloudbeds reconocido. Las fechas y los huéspedes se enviarán automáticamente.</small>}
  {!!url&&!status.secure&&<small style={{color:'#b44433'}}>Utiliza una dirección completa que empiece con https://</small>}
  {status.secure&&<a href={url} target="_blank" rel="noopener noreferrer" className="sede-maps-preview" style={{display:'inline-flex',alignItems:'center',gap:6}}>Probar este enlace <ExternalLink size={14}/></a>}
 </label>;
}
