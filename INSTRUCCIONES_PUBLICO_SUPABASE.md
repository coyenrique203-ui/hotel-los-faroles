# Hotel Los Faroles — páginas públicas conectadas a Supabase y R2

Este paquete contiene solamente los archivos nuevos o modificados; **no reemplaza el proyecto completo**. Haz una copia de los archivos que vas a sustituir.

## Instalación

1. Extrae el ZIP sobre `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles`, respetando las carpetas.
2. Conserva tu `.env.local` actual. Ya usamos las mismas variables públicas de Supabase configuradas para el login.
3. Detén y reinicia con `npm run dev`.
4. Visita `/coban`, `/antigua`, `/restaurante`, `/eventos` y la página de inicio.

## Cómo probar con la fotografía que ya subiste

1. En `/admin/galeria?sede=1`, verifica que la foto de Cobán tiene **Visible en la web**; puedes marcarla como **Principal**.
2. En `/admin/sedes/1`, marca **Publicar esta sede** y guarda.
3. Abre `http://localhost:5173/coban` (o el puerto que te indique `npm run dev`). Ahora deben mostrarse el nombre, la descripción, la dirección, los datos de contacto y las fotografías publicados en Supabase/R2.
4. Revisa la portada: las tarjetas reflejarán el contenido publicado y la foto de Cobán podrá sustituir la imagen de referencia.
5. Prueba editar la descripción en el administrador y refresca la página pública: el nuevo texto debe aparecer.

**IMPORTANTE:** Si `publicado=false`, la sede mantiene la maqueta de referencia, sin cargar datos privados de Supabase. Lo mismo sucede si Supabase está temporalmente indisponible. La maqueta continúa etiquetada como ilustrativa.

Las fotos individuales deben tener `publicada=true`. Si el bucket usa una URL `r2.dev`, funcionará para pruebas pero en producción debemos cambiar `R2_PUBLIC_URL` al dominio personalizado y actualizar las URLs existentes de Supabase (se hará con una migración controlada).

## Alcance de esta fase

- Las páginas públicas leen los campos de `sedes` y las fotos de `imagenes` ya creadas.
- Los botones de **solicitar reserva** siguen en modo demostración: aún **no** crean reservas ni bloquean habitaciones.
- El apartado de habitaciones conserva sus tarjetas ilustrativas: lo conectaremos a `tipos_habitacion` después.
- El diseño público no se ha sustituido.
