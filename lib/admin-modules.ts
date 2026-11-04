import {Building2,BedDouble,CalendarDays,Images,UtensilsCrossed,PartyPopper,FileText,Star,Users,Settings,LayoutDashboard,Clapperboard} from 'lucide-react';
export const adminModules=[
 {slug:'',label:'Resumen',icon:LayoutDashboard,description:'Vista general de la plataforma'},
 {slug:'portada',label:'Portada principal',icon:Clapperboard,description:'Video del encabezado de Inicio'},
 {slug:'sedes',label:'Sedes',icon:Building2,description:'Información, teléfonos y ubicaciones'},
 {slug:'habitaciones',label:'Habitaciones',icon:BedDouble,description:'Tipos, fotos y tarifas'},
 {slug:'resenas',label:'Reseñas',icon:Star,description:'Invitaciones y opiniones verificadas'},
 {slug:'reservas',label:'Reservas',icon:CalendarDays,description:'Solicitudes y disponibilidad'},
 {slug:'galeria',label:'Galería',icon:Images,description:'Imágenes y archivos de R2'},
 {slug:'restaurante',label:'Restaurante',icon:UtensilsCrossed,description:'Carta, mesas y horarios'},
 {slug:'eventos',label:'Eventos',icon:PartyPopper,description:'Consultas y contenidos del salón'},
 {slug:'contenido',label:'Contenido web',icon:FileText,description:'Textos y secciones públicas'},
 {slug:'usuarios',label:'Usuarios',icon:Users,description:'Administradores y permisos'},
 {slug:'configuracion',label:'Configuración',icon:Settings,description:'Preferencias del sistema'},
];
