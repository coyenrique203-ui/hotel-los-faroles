import {getPlatillos} from '@/lib/restaurante';
import {Photo} from '../photo';
import '@/styles/restaurante.css';

export async function RestaurantMenu({sedeId}:{sedeId?:number}){
 const platos=sedeId?await getPlatillos(sedeId,true):[];
 const categories=[...new Set(platos.map(p=>p.categoria))];
 return <section className="restaurant-menu wrap" id="carta"><div className="section-head"><div><span className="eyebrow">SABORES DE LOS FAROLES</span><h2>Nuestra <em>carta.</em></h2></div><p>Explora nuestras especialidades.<br/>Consulta disponibilidad y horarios directamente con nosotros.</p></div>
 {!platos.length?<div className="restaurant-menu-pending"><span>PRÓXIMAMENTE</span><h3>Estamos preparando algo especial.</h3><p>Muy pronto compartiremos aquí nuestra carta gastronómica.</p></div>:categories.map(category=><div className="restaurant-category" key={category}><h3>{category}</h3><div className="restaurant-dishes">{platos.filter(p=>p.categoria===category).map(p=><article className="restaurant-dish" key={p.id}>{p.imagen_url&&<div className="restaurant-dish-photo"><Photo src={p.imagen_url} alt={p.nombre}/></div>}<div className="restaurant-dish-body"><div><h4>{p.nombre}</h4>{p.precio!==null&&<strong>Q {Number(p.precio).toFixed(2)}</strong>}</div>{p.descripcion&&<p>{p.descripcion}</p>}</div></article>)}</div></div>)}
 </section>;
}
