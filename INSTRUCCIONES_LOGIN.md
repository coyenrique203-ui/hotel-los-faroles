# Instalación del módulo de acceso administrativo

Este paquete contiene únicamente los archivos nuevos o modificados del inicio de sesión de Hotel Los Faroles.

## 1. Copiar archivos

Extrae el paquete **sobre tu carpeta actual** `hotel-los-faroles`, conservando las rutas incluidas en el ZIP. Acepta reemplazar solamente los archivos de este paquete. Guarda una copia de seguridad de los archivos que ya hayas modificado por tu cuenta.

## 2. Instalar dependencias

Desde PowerShell en la carpeta del proyecto:

```powershell
npm install
```

El `package.json` y `package-lock.json` del paquete incluyen `@supabase/supabase-js` y `@supabase/ssr`.

## 3. Configurar Supabase

Crea el archivo `.env.local` en la raíz del proyecto usando el siguiente modelo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE_PUBLICA
```

Encuentra ambos valores en Supabase > Project Settings > API Keys o Connect. Copia **Project URL** y **Publishable key**. Si tu proyecto tiene una clave antigua `anon`, úsala como valor de `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` mientras migras a la nueva clave pública. **Nunca uses `service_role`, `sb_secret_...` ni la contraseña de la base de datos en esta variable.**

No envíes el contenido de `.env.local` al chat ni lo subas a GitHub. Debe quedar excluido del control de versiones.

## 4. Ejecutar

```powershell
npm run dev
```

Abre `http://localhost:3000/admin/login` (o el puerto indicado por la terminal) e ingresa con el usuario que registraste en Supabase Auth y `perfiles_admin`.

## 5. Comprobar

- Sin iniciar sesión, `/admin` debe redirigir al acceso.
- Un usuario activo con perfil en `perfiles_admin` debe acceder.
- Un usuario sin perfil administrativo debe recibir un mensaje de acceso denegado.
- El botón **Cerrar sesión** debe devolver a la pantalla de acceso.

## Alcance de esta entrega

Se implementa autenticación y verificación de cuenta administrativa activa. **Todavía no hay operaciones de administración que escriban datos**. Antes de habilitarlas, añadiremos políticas de autorización por sede y operaciones seguras en el servidor. No se ha probado un inicio de sesión real contra tu proyecto de Supabase porque sus claves no están configuradas aquí.
