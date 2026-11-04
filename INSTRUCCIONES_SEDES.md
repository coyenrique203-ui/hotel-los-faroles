# Hotel Los Faroles — módulo de administración de sedes

Este paquete trae **solo los archivos nuevos o modificados**. Se instala encima del proyecto local que ya tiene el login funcionando.

1. Haz una copia de seguridad de los archivos actuales que se reemplazarán.
2. Descomprime el ZIP dentro de `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles`, conservando las carpetas y aceptando reemplazar solo los archivos indicados.
3. En Supabase, abre **SQL Editor** y ejecuta el contenido de `supabase/sql/01_sedes_admin_policies.sql`. Este paso habilita lectura y edición para los administradores autorizados sin crear ni eliminar sedes.
4. Ejecuta `npm run dev` como siempre.
5. Abre `http://localhost:3000/admin`, inicia sesión y entra en **Sedes**. Selecciona una sede, modifica los datos y presiona **Guardar cambios**.

## Comprobaciones

- Los registros de la tabla `sedes` deben aparecer (incluso si `publicado=false`) para el administrador general.
- Al guardar, debe mostrarse un aviso verde y los valores deben persistir al recargar.
- El interruptor **Publicar esta sede** modifica `publicado` en Supabase; úsalo solo cuando la información esté lista.
- Un administrador de sede debe tener una fila en `admin_sedes` que vincule su usuario con la sede autorizada.
- Si recibes un error al guardar, revisa las políticas de `sedes`, la sesión y que la tabla tenga las columnas esperadas.

## Alcance

Este paso administra información, contacto, URL de imagen principal y publicación de sedes. Las imágenes aún no se suben a Cloudflare R2, y la web pública todavía usa el contenido visual inicial; conectarla a los datos reales será una fase posterior. No se ha implementado el motor de reservas.
