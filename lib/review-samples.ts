/** Contenido ilustrativo. Nunca presentar como reseñas verificadas de clientes. */
export type ReviewSample={title:string;comment:string;context:string};

export const reviewSamples:Record<'coban'|'antigua'|'restaurante'|'eventos',ReviewSample[]>={
 coban:[
  {title:'Un descanso en Cobán',comment:'Un lugar acogedor para hacer una pausa y explorar los paisajes de Alta Verapaz.',context:'Ejemplo de opinión sobre alojamiento'},
  {title:'Una estancia tranquila',comment:'Habitaciones cómodas y espacios pensados para descansar después de un día de aventura.',context:'Ejemplo de opinión sobre habitaciones'},
  {title:'Cerca de todo',comment:'Una ubicación práctica para descubrir el centro de Cobán y disfrutar de la ciudad.',context:'Ejemplo de opinión sobre ubicación'},
 ],
 antigua:[
  {title:'La magia de Antigua',comment:'Un ambiente cálido que invita a caminar por las calles históricas y disfrutar cada rincón.',context:'Ejemplo de opinión sobre experiencia'},
  {title:'Una visita especial',comment:'Un espacio para desconectarse del ritmo diario y disfrutar la esencia de Antigua Guatemala.',context:'Ejemplo de opinión sobre estadía'},
  {title:'Momentos para recordar',comment:'Una escapada ideal para compartir en pareja o descubrir una nueva ciudad.',context:'Ejemplo de opinión sobre viaje'},
 ],
 restaurante:[
  {title:'Sabores para compartir',comment:'Una mesa agradable para reunirse, conversar y disfrutar de una comida sin prisas.',context:'Ejemplo de opinión sobre ambiente'},
  {title:'Una buena ocasión',comment:'El tipo de lugar que elegiríamos para celebrar un momento especial en Antigua.',context:'Ejemplo de opinión sobre experiencia'},
  {title:'Encuentros alrededor de la mesa',comment:'Un ambiente pensado para disfrutar en familia o con amigos.',context:'Ejemplo de opinión sobre reuniones'},
 ],
 eventos:[
  {title:'Un espacio para celebrar',comment:'Aquí podría aparecer la experiencia de quienes celebren una ocasión especial.',context:'Ejemplo para eventos futuros'},
  {title:'Cada detalle cuenta',comment:'Las opiniones reales podrán destacar la atención, la ambientación y la organización.',context:'Ejemplo para eventos futuros'},
  {title:'Momentos inolvidables',comment:'Cuando se inaugure el salón, esta sección podrá mostrar comentarios de los asistentes.',context:'Ejemplo para eventos futuros'},
 ],
};
