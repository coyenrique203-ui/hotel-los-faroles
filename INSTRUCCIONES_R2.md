# Hotel Los Faroles — administración de imágenes con Cloudflare R2

Este ZIP contiene **únicamente archivos nuevos y modificados** para agregar la galería a tu proyecto actual. No reinstales el proyecto completo.

## 1. Copiar archivos

Extrae el ZIP sobre `C:\Users\coylu\Desktop\PROYECTOS\hotel-los-faroles` y conserva las carpetas. Haz copia de seguridad de los archivos que reemplazas.

En PowerShell, dentro del proyecto, ejecuta:

```powershell
npm install
```

El paquete incluye los cambios de `package.json` y `package-lock.json` para agregar `@aws-sdk/client-s3`.

## 2. Permisos de Supabase

En **Supabase > SQL Editor**, ejecuta `supabase/sql/02_imagenes_admin_policies.sql`.

La migración crea políticas para los administradores autorizados. No elimina imágenes ni modifica sus columnas. La tabla `imagenes` debe conservar las 12 columnas que comprobamos.

## 3. Preparar R2

Ya tienes el bucket `hotel-los-faroles` creado.

1. En Cloudflare R2, abre la sección de **API Tokens** y crea un token de R2 con **Object Read & Write** limitado al bucket `hotel-los-faroles`. Guarda **Access Key ID** y **Secret Access Key** en un lugar seguro. No los envíes por chat ni los subas a GitHub.
2. Para pruebas locales, abre el bucket > **Settings > Public Development URL** y habilita la URL `r2.dev`. Copia la URL HTTPS que te muestra Cloudflare. Esta URL es solo para desarrollo; en producción usaremos tu dominio personalizado.
3. Busca tu **Account ID** de Cloudflare R2, que NO es la misma clave que Access Key ID.

En tu archivo `.env.local` existente añade estas líneas (sin borrar las de Supabase):

```env
R2_ACCOUNT_ID=ID_DE_TU_CUENTA_CLOUDFLARE
R2_BUCKET=hotel-los-faroles
R2_ACCESS_KEY_ID=TU_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY=TU_SECRET_ACCESS_KEY
R2_PUBLIC_URL=https://TU_URL_PUBLICA.r2.dev
```

En `R2_PUBLIC_URL` pega la URL exacta que Cloudflare haya generado, sin `/` al final. **Nunca agregues `NEXT_PUBLIC_` a las claves privadas**.

Detén y reinicia `npm run dev` después de guardar `.env.local`.

## 4. Probar

1. Inicia sesión en el panel de administración.
2. Abre `http://localhost:3000/admin/galeria`.
3. Elige **Hotel Los Faroles Cobán** y sube una foto pequeña JPG, PNG o WebP (máximo 8 MB).
4. Revisa que aparezca en la galería y que el archivo esté en el bucket dentro de `sedes/coban/`.
5. Prueba marcarla como **Principal**. Esto también actualiza `sedes.imagen_principal` en Supabase.
6. Si quieres, prueba ocultar/mostrar imágenes y luego eliminarlas. **Eliminar** borra definitivamente el registro y el objeto R2 después de tu confirmación.

## Consideraciones

- Las fotos de la galería se registran en `imagenes` y se asocian a `sede_id`; no se crea una segunda tabla.
- Por ahora el formulario sube **una foto por vez** y conserva sus archivos originales; la optimización automática y la carga múltiple pueden añadirse luego.
- La web pública todavía usa su contenido inicial. El siguiente paso es conectarla a Supabase/R2 para que muestre estas fotos.
- Solo se admiten JPG, PNG y WebP, validados por tamaño y formato en el servidor.
- Si `R2_PUBLIC_URL` tiene una URL privada o equivocada, el archivo podría subir, pero no se verá en la galería.
- Este módulo utiliza credenciales privadas **solo en el servidor**. Nunca copies `.env.local` al ZIP ni al repositorio.
