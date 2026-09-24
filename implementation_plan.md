# Plan de Integración Full-Stack: Frontend a Backend

Este plan detalla los pasos para conectar la interfaz gráfica (React/Vite) con nuestro nuevo servidor seguro (Express/Prisma), pasando de usar datos simulados a datos reales en la base de datos.

## User Review Required

> [!WARNING]
> **Base de Datos:** Para que esto funcione, necesitas tener **PostgreSQL** instalado en tu computadora Windows (o usar Docker).
> 
> Si ya lo tienes, asegúrate de que el usuario `postgres` y la contraseña `postgres` estén configurados, o edita la URL de conexión en `backend/.env`.
> Si no lo tienes, deberás descargarlo desde [postgresql.org](https://www.postgresql.org/download/windows/) e instalarlo antes de que podamos hacer el `Prisma Push`.

## Proposed Changes

### 1. Configuración de Base de Datos y Prisma
Una vez confirmes que PostgreSQL está corriendo:
- Ejecutaremos el comando `npx prisma db push` desde la carpeta del backend.
- Esto creará automáticamente las tablas `User` y `Session` en tu base de datos local.
- Generaremos el Prisma Client para que el backend pueda realizar consultas.

### 2. Cliente de Red (Axios) en el Frontend
Para hablar con el servidor seguro, el frontend debe enviar las cookies automáticamente.
- **Creación de [api.js]:** Un archivo centralizado donde se configurará Axios con `withCredentials: true` apuntando a `http://localhost:4000/api`.

### 3. Conexión del Estado (Zustand) con el Backend
Modificaremos cómo el frontend maneja la sesión actual.
#### [MODIFY] [useStore.js]
- Agregaremos un estado `user` y `isAuthenticated`.
- Agregaremos una función `checkAuth()` que llame a `GET /api/auth/me` (que crearemos en el backend) al cargar la app para saber si las cookies HttpOnly siguen siendo válidas.

### 4. Flujos de Pantallas
#### [MODIFY] [Login.jsx]
- Conectar el formulario a `POST /api/auth/login`.
- Si las credenciales son válidas, actualizará el `useStore` y redirigirá al inventario.

#### [MODIFY] [AdminLayout.jsx] y Rutas Privadas
- Modificaremos la protección de rutas. Si un usuario intenta entrar a `/admin` y la llamada al backend devuelve error 401 (No autorizado) o 403 (No es admin), el frontend lo redirigirá al Login de manera segura.

### 5. Backend: Endpoint de Verificación de Sesión
#### [MODIFY] [auth.routes.js] & [auth.controller.js]
- Agregaremos la ruta `GET /api/auth/me` protegida por el middleware `requireAuth`. Esta ruta devolverá la información básica del usuario (ID, Nombre, Rol) si las cookies siguen vigentes en la base de datos.

## Verification Plan

### Manual Verification
1. Levantaremos PostgreSQL.
2. Ejecutaremos el servidor backend y el servidor frontend en paralelo.
3. Intentaremos entrar al panel administrativo sin iniciar sesión (deberá bloquearnos).
4. Crearemos un usuario administrador desde el backend, o intentaremos registrarnos e iniciar sesión desde la UI para validar que las cookies se envían, la sesión se mantiene, y podemos acceder al panel.
