# Hotel Los Faroles — habitaciones en la web pública

Este ZIP contiene **solo los tres archivos nuevos/modificados** para conectar las tarjetas de habitaciones con Supabase. No reemplaza el resto del proyecto.

## Instalar

1. Haz una copia de seguridad de los archivos que se reemplazarán.
2. Extrae el ZIP dentro de `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles`, respetando las carpetas.
3. Reinicia el servidor con `npm run dev`.

## Prueba de Cobán

1. Entra a **Administración → Habitaciones** y selecciona Cobán.
2. Edita el tipo **Habitación Doble** creado anteriormente y marca **Publicar este tipo de habitación**. Guarda.
3. En **Administración → Sedes → Cobán**, comprueba que **Publicar esta sede** esté activado y guarda si es necesario.
4. Abre `/coban` y baja a **Nuestras habitaciones**. Ahora la tarjeta debe mostrar el nombre, descripción, capacidad, camas y precio desde Q350.00, si conservaste ese valor.
5. Cambia la descripción o el precio en el administrador, guarda y recarga `/coban` para comprobar la actualización.

Para Antigua, repite el procedimiento con un tipo asociado a esa sede.

## Fotografías

Si un tipo tiene `imagen_principal` con una URL HTTPS pública de R2, se mostrará en su tarjeta. Si no tiene fotografía propia, la tarjeta utilizará la imagen general de la sede.

**Importante:** el botón **Consultar disponibilidad** aún es demostrativo: no bloquea ni reserva ninguna habitación. El número de habitación física (101, 102, etc.) y las observaciones internas nunca se muestran públicamente.

No se requieren dependencias nuevas ni SQL adicional; utilizamos la tabla `tipos_habitacion` y sus políticas públicas que ya creamos.
