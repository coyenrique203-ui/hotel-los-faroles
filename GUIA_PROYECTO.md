# Hotel Los Faroles — guía de desarrollo

## Estado actual

Prototipo visual con Next.js (Vinext), React, TypeScript y Tailwind CSS. No está conectado a Supabase ni a Cloudflare R2. Las imágenes son ilustrativas. Las reservas, consultas y el panel administrativo **no guardan datos**.

**Importante:** `/admin` es una demostración sin autenticación. No publicar el proyecto como sistema operativo de hotel hasta implementar inicio de sesión, permisos por sede y controles de seguridad en el servidor.

## Iniciar en Windows (PowerShell)

Requisitos: Node.js 22.13 o posterior.

```powershell
npm install
npm run dev
```

Visitar la dirección local que indique la consola (normalmente `http://localhost:3000`). El archivo `.openai/hosting.json` forma parte de este paquete; no debe excluirse.

## Rutas públicas

| URL | Vista |
| --- | --- |
| `/` | Inicio de la marca |
| `/coban` | Hotel Los Faroles Cobán |
| `/antigua` | Hotel Los Faroles Antigua |
| `/restaurante` | Restaurante |
| `/eventos` | Salón de eventos |

## Rutas administrativas

`/admin` es el resumen. Los módulos tienen rutas independientes: `/admin/sedes`, `/admin/habitaciones`, `/admin/reservas`, `/admin/galeria`, `/admin/restaurante`, `/admin/eventos`, `/admin/contenido`, `/admin/usuarios` y `/admin/configuracion`.

## Organización

```text
app/
  (public)/                 # Páginas públicas y layout propio
    coban/                  # Hotel Cobán
    antigua/                # Hotel Antigua
    restaurante/            # Restaurante
    eventos/                # Eventos
  admin/                    # Layout y rutas administrativas
  globals.css               # Estilos base y portada (pendiente división fina)
components/
  public/
    home/                   # Secciones de la portada
    venue/                  # Vista reutilizable para sedes
    booking-search.tsx      # Buscador visual de estancia
    site-header.tsx         # Navbar compartido
    site-footer.tsx         # Footer compartido
    demo-action.tsx         # Aviso para funciones no conectadas
    photo.tsx               # Imágenes ilustrativas
  admin/
    admin-shell.tsx         # Navegación administrativa
    admin-widgets.tsx       # Dashboard y módulos demo
lib/
  hotel-content.ts          # Datos iniciales de sedes y fotografías
  admin-modules.ts          # Catálogo de módulos administrativos
styles/
  venues.css                # Estilos de las páginas de sedes
  admin.css                 # Estilos del administrador
```

## Próximas fases

1. Sustituir imágenes y textos por contenido real de Los Faroles.
2. Crear fichas de habitaciones y componentes editables con datos de Supabase.
3. Conectar Cloudflare R2 para cargar fotografías y cartas de restaurante.
4. Implementar Supabase Auth y autorización por roles/sedes antes de publicar `/admin`.
5. Investigar el sistema hotelero existente antes de implementar bloqueo real de disponibilidad y confirmaciones.
6. Añadir reglas de no doble reserva, validaciones y notificaciones.

La vista de habitaciones y sus nombres son ejemplos, no un inventario real. No existe disponibilidad ni tarifario conectado.
