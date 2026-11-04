export type Venue = { slug: string; name: string; location: string; type: 'hotel'|'restaurant'|'events'; tagline: string; introduction: string; hero: string; gallery: string[]; highlights: {title:string;description:string}[] };

export const photos = {
  hero:'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2400&q=85',
  coban:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1500&q=85',
  antigua:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85',
  restaurant:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85',
  room:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
  events:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=85',
  dining:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85',
  suite:'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
  courtyard:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
};

export const venues: Record<string,Venue> = {
  coban:{slug:'coban',name:'Los Faroles Cobán',location:'Cobán, Alta Verapaz',type:'hotel',tagline:'Donde la naturaleza invita a quedarse.',introduction:'Un espacio para bajar el ritmo, descubrir los paisajes de Alta Verapaz y disfrutar de una estancia acogedora.',hero:photos.coban,gallery:[photos.room,photos.courtyard,photos.suite],highlights:[{title:'Habitaciones',description:'Explora nuestras opciones de alojamiento y encuentra la ideal para tu viaje.'},{title:'Naturaleza y descanso',description:'Una experiencia para conectar con el entorno y disfrutar cada instante.'},{title:'Ubicación',description:'Conoce cómo llegar y solicita información sobre nuestra sede en Cobán.'}]},
  antigua:{slug:'antigua',name:'Los Faroles Antigua',location:'Antigua Guatemala, Sacatepéquez',type:'hotel',tagline:'Una estancia llena de encanto e historia.',introduction:'Descubre el carácter de Antigua Guatemala y vive una experiencia para recordar, entre cultura, arquitectura y momentos de calma.',hero:photos.antigua,gallery:[photos.suite,photos.room,photos.courtyard],highlights:[{title:'Habitaciones',description:'Conoce los espacios disponibles para descansar después de explorar la ciudad.'},{title:'La experiencia Antigua',description:'Una invitación a descubrir calles, arquitectura y cultura.'},{title:'Ubicación',description:'Encuentra información de la sede y planifica tu llegada.'}]},
  restaurante:{slug:'restaurante',name:'Restaurante Los Faroles',location:'Experiencia gastronómica',type:'restaurant',tagline:'Sabores para compartir momentos.',introduction:'Un lugar para reunirse, conversar y disfrutar del placer de sentarse a la mesa.',hero:photos.restaurant,gallery:[photos.dining,photos.restaurant,photos.courtyard],highlights:[{title:'Nuestra carta',description:'Próximamente podrás explorar el menú completo desde esta página.'},{title:'Reserva de mesas',description:'Preparamos una solicitud sencilla, sin pagos en línea.'},{title:'Horarios y ubicación',description:'Publicaremos aquí los datos confirmados del restaurante.'}]},
  eventos:{slug:'eventos',name:'Eventos Los Faroles',location:'Próximamente',type:'events',tagline:'Momentos que merecen celebrarse.',introduction:'Estamos preparando un espacio especial para encuentros, celebraciones y nuevas historias.',hero:photos.events,gallery:[photos.events,photos.dining,photos.courtyard],highlights:[{title:'Celebraciones',description:'Un espacio pensado para reunir a las personas importantes.'},{title:'Eventos corporativos',description:'Explora opciones para reuniones y encuentros.'},{title:'Solicita información',description:'Cuéntanos tu idea cuando habilitemos el formulario de eventos.'}]},
};

export const roomSamples=[{name:'Habitación Clásica',image:photos.room,description:'Una propuesta acogedora para descansar a tu ritmo.'},{name:'Habitación Superior',image:photos.suite,description:'Ambientes amplios y detalles para disfrutar de la estancia.'}];
