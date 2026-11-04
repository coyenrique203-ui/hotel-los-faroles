# Hotel Los Faroles — administración de habitaciones

Este paquete modifica únicamente los archivos necesarios. Instálalo sobre el proyecto actual (el que ya tiene acceso a Supabase y Cloudflare R2).

1. Haz una copia de seguridad de los archivos que se reemplazarán.
2. Extrae el ZIP en `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles`, conservando las carpetas.
3. En **Supabase > SQL Editor**, ejecuta `supabase/sql/03_habitaciones_admin_policies.sql`.
4. Reinicia la aplicación con `npm run dev`.
5. Abre la ruta **Administración > Habitaciones**.

## Prueba recomendada

1. Selecciona **Hotel Los Faroles Cobán**.
2. En **Crear tipo de habitación**, registra por ejemplo:
   - Nombre: `Habitación Doble`
   - Identificador: `habitacion-doble` (solo minúsculas, números y guiones)
   - Capacidad: `2`
   - Camas: `1`
   - Tipo de cama: `Matrimonial`
   - Precio desde: `350.00`
   - Déjalo inicialmente **sin publicar**.
3. Guarda y comprueba que el tipo aparezca arriba y en Supabase > `tipos_habitacion`.
4. En **Registrar habitación física**, elige ese tipo, escribe `101`, selecciona `Operativa` y guarda.
5. Comprueba que aparezca la habitación 101 en la lista y en Supabase > `habitaciones`.
6. Usa **Editar** para cambiar los datos y verifica que se conserven después de recargar.

## Aclaraciones

- Los tipos son comerciales (por ejemplo, Habitación Doble). Las habitaciones físicas son unidades reales (101, 102, 103...).
- Los precios se ingresan en quetzales **Q**, con dos decimales cuando corresponda.
- Puedes colocar una URL de imagen principal de R2; la carga directa de fotos por tipo y la galería de habitaciones serán una mejora aparte.
- **Aún no se bloquean habitaciones ni se aceptan reservas reales**: falta construir disponibilidad y la integración con el sistema de reservas actual del hotel.
- Las páginas públicas mantienen por ahora las tarjetas ilustrativas de habitaciones. Las conectaremos con los tipos publicados en la siguiente fase.
- Esta etapa no permite borrar habitaciones para evitar pérdidas accidentales de datos.
