export const ROOM_AMENITIES=[
 {id:'wifi',label:'Wi-Fi',icon:'wifi',group:'Conectividad'},
 {id:'tv',label:'Televisión',icon:'tv',group:'Entretenimiento'},
 {id:'cable',label:'TV por cable',icon:'tv',group:'Entretenimiento'},
 {id:'aire',label:'Aire acondicionado',icon:'wind',group:'Climatización'},
 {id:'ventilador',label:'Ventilador',icon:'fan',group:'Climatización'},
 {id:'calefaccion',label:'Calefacción',icon:'thermometer-sun',group:'Climatización'},
 {id:'bano',label:'Baño privado',icon:'bath',group:'Baño'},
 {id:'agua',label:'Agua caliente',icon:'shower-head',group:'Baño'},
 {id:'jacuzzi',label:'Jacuzzi',icon:'waves',group:'Baño'},
 {id:'toallas',label:'Toallas y amenidades',icon:'soap-dispenser-droplet',group:'Baño'},
 {id:'cocina',label:'Cocina',icon:'cooking-pot',group:'Equipamiento'},
 {id:'refri',label:'Refrigeradora',icon:'refrigerator',group:'Equipamiento'},
 {id:'cafetera',label:'Cafetera',icon:'coffee',group:'Equipamiento'},
 {id:'sofa',label:'Sofá cama',icon:'sofa',group:'Confort'},
 {id:'balcon',label:'Balcón',icon:'sun',group:'Confort'},
 {id:'chimenea',label:'Chimenea',icon:'flame',group:'Confort'},
 {id:'caja',label:'Caja fuerte',icon:'lock-keyhole',group:'Seguridad'},
 {id:'escritorio',label:'Escritorio',icon:'briefcase-business',group:'Confort'},
 {id:'parqueo',label:'Estacionamiento',icon:'car-front',group:'Servicios'},
 {id:'desayuno',label:'Desayuno incluido',icon:'utensils',group:'Servicios'},
] as const;
export const AMENITY_GROUPS=['Conectividad','Entretenimiento','Climatización','Baño','Equipamiento','Confort','Seguridad','Servicios'] as const;

export function amenityLabel(value:string){return ROOM_AMENITIES.find(item=>item.id===value)?.label??value;}
export function amenityIcon(value:string){return ROOM_AMENITIES.find(item=>item.id===value)?.icon??'check';}
