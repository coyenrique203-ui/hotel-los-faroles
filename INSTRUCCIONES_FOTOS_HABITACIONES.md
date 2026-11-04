# Hotel Los Faroles — galería de fotos por tipo de habitación

El ZIP incluye **solo archivos nuevos y modificados**. Instálalo sobre el proyecto que ya tiene funcionando Supabase, R2 y el módulo de habitaciones.

## Instalación

1. Haz una copia de los archivos actuales que se reemplazarán.
2. Extrae el ZIP dentro de `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles`, respetando las carpetas.
3. En **Supabase > SQL Editor**, ejecuta `supabase/sql/04_imagenes_habitaciones_policies.sql`.
4. Reinicia con `npm run dev`.

No es necesario crear otro bucket ni instalar dependencias nuevas: seguimos utilizando `aws4fetch` y el bucket `hotel-los-faroles`.

## Prueba con Habitación Doble de Cobán

1. Entra a **Administración > Habitaciones** y selecciona Cobán.
2. En la tarjeta de **Habitación Doble**, haz clic en **Administrar fotografías**.
3. Sube una foto JPG, PNG o WebP de máximo 8 MB. Repite para subir dos o tres fotografías.
4. Marca una fotografía como **Principal**. Se actualizará también `tipos_habitacion.imagen_principal`.
5. Prueba las flechas de orden y la opción de ocultar/mostrar.
6. Verifica que **Habitación Doble** y la sede Cobán sigan publicadas.
7. En `/coban`, busca la tarjeta Habitación Doble. Deben aparecer la foto principal, miniaturas y un botón **Ver galería** para abrir el visor.

## Seguridad y alcance

- Las fotos se registran en la tabla `imagenes` utilizando `tipo_habitacion_id`; `sede_id` debe quedar en `NULL` para evitar confundirlas con la galería general de la sede.
- Los archivos se guardan en `habitaciones/{slug-sede}/{slug-tipo}/{uuid}.jpg|png|webp` dentro de R2.
- Solo se consultan fotos con `publicada=true` y tipos/sedes publicados.
- **Eliminar** borra definitivamente la fila y el objeto en R2, previa confirmación. Si falla R2 después de eliminar la fila, puede quedar un archivo huérfano; el panel mostrará un aviso.
- El visor de imágenes permite moverse con flechas y cerrar con Escape.
- El botón **Consultar disponibilidad** todavía no hace reservas reales ni bloquea unidades.

**Nota:** esta fase permite subir una imagen por vez. Más adelante podemos optimizar automáticamente el tamaño y habilitar carga múltiple.
