import {getEventActivities} from '@/lib/event-activities';
import {Photo} from '../photo';
import '@/styles/experiencias.css';

export async function EventActivityGallery({sedeId}:{sedeId?:number}){
 const activities=sedeId?await getEventActivities(sedeId,true):[];
 return <section className="event-activities wrap" id="celebraciones"><div className="section-head"><div><span className="eyebrow">MOMENTOS QUE PERDURAN</span><h2>Celebraciones <em>con historia.</em></h2></div><p>Conoce algunos de los momentos especiales que hemos acompañado.</p></div>
 {activities.length?<div className="event-activity-grid">{activities.map(a=><article className="event-activity-card" key={a.id}><div className="event-activity-photos">{a.fotos.map((photo,i)=><div className="event-activity-image" key={photo.id}><Photo src={photo.url_publica} alt={a.titulo+' · fotografía '+(i+1)}/></div>)}</div><div className="event-activity-content">{a.fecha_evento&&<time dateTime={a.fecha_evento}>{new Date(a.fecha_evento+'T12:00:00').toLocaleDateString('es-GT',{year:'numeric',month:'long'})}</time>}<h3>{a.titulo}</h3>{a.descripcion&&<p>{a.descripcion}</p>}</div></article>)}</div>:<div className="event-activity-empty"><span>PRÓXIMAMENTE</span><h3>Momentos para recordar.</h3><p>Pronto compartiremos las celebraciones que llenan de vida nuestros espacios.</p></div>}
 </section>;
}
