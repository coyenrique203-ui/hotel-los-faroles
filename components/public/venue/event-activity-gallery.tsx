import {getEventActivities} from '@/lib/event-activities';
import {InteractiveEventActivities} from './interactive-event-activities';
import '@/styles/experiencias.css';

export async function EventActivityGallery({sedeId}:{sedeId?:number}){
 const activities=sedeId?await getEventActivities(sedeId,true):[];
 return <section className="event-activities wrap" id="celebraciones"><div className="section-head"><div><span className="eyebrow">MOMENTOS QUE PERDURAN</span><h2>Celebraciones <em>con historia.</em></h2></div><p>Conoce algunos de los momentos especiales que hemos acompañado.</p></div>
 {activities.length?<InteractiveEventActivities activities={activities}/>:<div className="event-activity-empty"><span>PRÓXIMAMENTE</span><h3>Momentos para recordar.</h3><p>Pronto compartiremos las celebraciones que llenan de vida nuestros espacios.</p></div>}
 </section>;
}
