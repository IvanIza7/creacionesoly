# Plan de Preparación para Despliegue Inicial y Migración a Correo Empresarial

Este documento detalla la arquitectura, procesos y protocolos necesarios para desplegar el sistema de JV GOLD & CO LLC en una primera fase (sin correo corporativo definitivo) y la posterior migración sin interrupciones ni pérdida de datos cuando el cliente adquiera su dominio y servicio de correo empresarial.

---

## 1. Arquitectura Desacoplada

El sistema ha sido diseñado bajo principios de **separación de responsabilidades (Separation of Concerns)**, lo que garantiza que ninguna configuración temporal se convierta en deuda técnica.

### Separación Estructural:
*   **Configuración del Negocio (Base de Datos):** Textos, redes sociales, número de WhatsApp, logos y horarios viven en la tabla `BusinessSettings` de PostgreSQL y son administrables desde el *Site Editor*.
*   **Configuración del Proveedor de Correo (Variables de Entorno):** El envío de correos (Resend/SMTP) se maneja a nivel de infraestructura mediante el archivo `.env`. El código fuente no conoce los detalles del proveedor, solo consume la variable `RESEND_API_KEY` (o equivalentes SMTP).
*   **Datos y Estado (PostgreSQL):** Usuarios, productos, colecciones, favoritos, y suscriptores residen exclusivamente en la base de datos transaccional, independientes de cómo se envían los correos.
*   **Archivos Multimedia (Volumen de Almacenamiento):** Las imágenes y recursos estáticos se manejan en un directorio separado (`/uploads`) y se referencian mediante rutas relativas (`/uploads/filename.webp`), independizándolos del dominio donde se hospede la aplicación.

> [!NOTE]
> **Beneficio para futuras migraciones:** Al mantener las credenciales de correo como Variables de Entorno, cambiar de proveedor (ej. de un correo temporal a Google Workspace/Microsoft 365) requiere **cero cambios en el código** y **cero interacción con la base de datos**. Solo se actualiza el entorno y se reinicia el servidor.

---

## 2. Despliegue Inicial (Fase 1)

El sitio entrará en producción completa con un proveedor de correo transaccional provisional (ej. Resend con un dominio genérico o verificado temporalmente) configurado solo para asegurar el flujo de registro y recuperación de contraseñas.

**Características de la Fase 1:**
*   **Operación Normal:** El cliente podrá gestionar inventario, usuarios, catálogos y atender ventas vía WhatsApp sin restricciones.
*   **Persistencia Real:** Todos los datos generados (usuarios, productos, imágenes recortadas) se guardan en la base de datos de producción y almacenamiento persistente. No existen "datos de prueba" en el entorno en vivo.
*   **Notificaciones:** El sistema enviará los correos de verificación y recuperación. Si el remitente es genérico (ej. `onboarding@resend.dev`), se configurará el "Reply-To" al correo personal del cliente para no perder comunicación de los usuarios.

---

## 3. Preparación para la Migración (Fase 2)

El diseño asegura que la transición al correo empresarial sea trivial. 

**Elementos independientes del proveedor de correo (No requieren cambios):**
*   Tokens de sesión (JWT) y de verificación (hashes encriptados en BD).
*   Catálogo de productos e inventario.
*   Imágenes y archivos subidos.
*   La lógica interna del backend (Controladores de Auth).

**Lo único que se actualizará:**
1.  Registro CNAME/TXT en los DNS del nuevo dominio para autorizar el envío.
2.  Variable `RESEND_API_KEY` (o configuración SMTP: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) en el `.env` del servidor.
3.  Variable `CONTACT_EMAIL` o configuración del remitente por defecto (`FROM_EMAIL`).

---

## 4. Respaldo Completo (Backup Strategy)

Antes de cualquier migración, es imperativo realizar un *Snapshot* completo del sistema.

### Elementos del Respaldo:
1.  **Base de Datos:** Volcado completo de PostgreSQL (`pg_dump`).
2.  **Imágenes:** Compresión del directorio `/uploads`.
3.  **Configuración del Servidor:** Copia de seguridad de los archivos `.env` (guardados de forma cifrada en un vault de contraseñas, no en el repositorio).
4.  **Repositorio Git:** Commit congelado de la versión exacta en producción (tagging).

### Verificación del Respaldo:
*   **Restauración en Staging:** Se levantará un entorno local o de pruebas usando el archivo de volcado `.sql` y la carpeta `uploads` respaldada.
*   **Prueba de Integridad:** Se verificará que el total de registros en las tablas coincida con producción y que las imágenes se rendericen correctamente.

---

## 5. Migración del Correo Empresarial (Paso a Paso)

Este procedimiento garantiza cero tiempo de inactividad (Zero Downtime) respecto a la navegación web.

1.  **Respaldo Completo:** Ejecución del script de backup y verificación (ver sección 4).
2.  **Configuración de DNS:** Agregar registros MX, SPF, DKIM y DMARC proporcionados por el nuevo servicio (ej. Google Workspace) en el panel del dominio (`ejemplo.com`).
3.  **Autorización del Dominio:** Si se usa un servicio como Resend, verificar el nuevo dominio en su panel para autorizar envíos desde `info@ejemplo.com`.
4.  **Actualización de Variables de Entorno:**
    *   Modificar `.env` en el servidor con las nuevas claves o credenciales SMTP.
    *   Actualizar `FRONTEND_URL` si hay cambio de dominio.
5.  **Reinicio Controlado:** Reiniciar el servicio backend (ej. `pm2 restart backend`) para que tome las nuevas variables. Tiempo de inactividad estimado: < 5 segundos.
6.  **Pruebas de Validación:** (Ver sección 6).
7.  **Monitoreo:** Revisión de logs en tiempo real para descartar correos rebotados (`Bounced`).
8.  **Cierre:** Confirmación de migración exitosa.

---

## 6. Verificaciones Post-Migración

Una vez reiniciado el servicio con el nuevo correo, el equipo QA (o responsable asignado) ejecutará el siguiente checklist:

*   [ ] **Registro:** Crear una cuenta de prueba y verificar recepción del correo de confirmación. Remitente debe ser el nuevo dominio.
*   [ ] **Confirmación de Correo:** Hacer clic en el enlace del correo y validar activación de la cuenta.
*   [ ] **Recuperación de Contraseña:** Solicitar reinicio de contraseña y validar recepción y funcionamiento del token.
*   [ ] **Inicio de Sesión:** Verificar que las cuentas existentes sigan accediendo normalmente.
*   [ ] **Formularios / WhatsApp:** Confirmar que los botones de contacto en el frontend funcionan y apuntan al número correcto.
*   [ ] **Logs:** Revisar consola del servidor buscando errores 500 o fallos de conexión SMTP/API.

---

## 7. Integridad de Datos

Para garantizar la no pérdida de información, se ejecutarán consultas de validación en la base de datos antes y después del reinicio:

*   Conteo de Usuarios: `SELECT count(*) FROM "User";`
*   Conteo de Productos: `SELECT count(*) FROM "Product" /* O desde el store de Zustand si están mockeados */;`
*   Conteo de Suscriptores: `SELECT count(*) FROM "NewsletterSubscriber";`

Las configuraciones gráficas (Site Editor) se validarán visualmente en el frontend.

---

## 8. Procedimiento de Rollback (Plan de Contingencia)

Si la migración del correo falla (ej. correos no llegan, bloqueo de spam, credenciales erróneas), el objetivo es restaurar el servicio en menos de 2 minutos.

### Pasos de Rollback:
1.  **Reversión del Entorno:** Restaurar el archivo `.env` anterior (que utilizaba el correo transaccional provisional).
2.  **Reinicio:** Ejecutar `pm2 restart backend`.
3.  **Verificación de Rollback:** Enviar un correo de prueba de recuperación de contraseña para confirmar que el sistema vuelve a usar el proveedor temporal.
4.  **Análisis:** Investigar el fallo en staging sin afectar producción.

> [!CAUTION]
> Durante un Rollback por fallo de correo **NO se debe restaurar la base de datos**, ya que el problema fue de infraestructura (envío). Restaurar la base de datos eliminaría las compras, registros o cambios que hayan ocurrido durante los minutos de la ventana de migración.

---

## 9. Documentación y Tiempos Estimados

**Responsables:** DevOps / Administrador del Servidor.

**Tiempos Estimados:**
*   Respaldo y verificación: 15 mins.
*   Configuración DNS (puede tomar hasta 24h en propagarse, pero la configuración real toma 10 mins).
*   Cambio de variables y reinicio: 2 mins.
*   Pruebas de validación QA: 15 mins.
*   **Tiempo total de intervención activa:** ~45 minutos.
*   **Tiempo de inactividad de la API:** ~5 segundos (durante el reinicio).

---

## 10. Configuración del Sistema (Personalización Continua)

El sistema soporta cambios en los metadatos del negocio **en tiempo de ejecución**.
A través del **Panel de Administración > Editor del Sitio**, el cliente puede cambiar:
*   Logotipo y modo de visualización.
*   Número de WhatsApp destino.
*   Textos del Hero y Colecciones.
*   Textos y correos en el Footer.
Estas opciones modifican la tabla `BusinessSettings` o el Store Persistente (Zustand), reflejándose inmediatamente sin necesidad de tocar código.

Por seguridad, secretos como el `JWT_SECRET`, la cadena de conexión a PostgreSQL (`DATABASE_URL`) y `RESEND_API_KEY` están estrictamente limitados al entorno de despliegue (`.env`).

---

## 11. Escalabilidad a Futuro

La arquitectura implementada soporta migración de proveedores en cualquier capa:

*   **De Hosting/Servidor:** Al estar contenerizado o manejado por PM2 y NPM, el código puede moverse de un VPS a AWS, Heroku o Vercel instalando dependencias y copiando el `.env`.
*   **De Base de Datos:** PostgreSQL facilita migraciones a servicios gestionados (AWS RDS, Supabase, Neon) cambiando la `DATABASE_URL`. Prisma ORM se encarga de mantener la estructura intacta.
*   **De Almacenamiento:** El módulo actual de subida local (`/uploads`) está centralizado en el middleware de multer. Si en el futuro se requieren terabytes de imágenes, se puede sustituir la lógica local por un SDK de AWS S3 o Cloudinary, cambiando un solo archivo (`upload.routes.js`).

---

## 12. Entregables Generados en este Plan

1.  **Arquitectura Desacoplada (Sección 1 y 10).**
2.  **Estrategia de Despliegue de Fase 1 (Sección 2).**
3.  **Checklist de Respaldo y Verificación (Sección 4 y 7).**
4.  **Procedimiento Paso a Paso de Migración (Sección 5).**
5.  **Checklist QA de Validación (Sección 6).**
6.  **Plan Estricto de Rollback (Sección 8).**

Este diseño estratégico garantiza al cliente que su negocio no se detiene hoy por falta de un dominio, y que mañana, cuando consolide su marca digitalmente, el software estará listo para asimilarlo como un proceso trivial de operaciones IT.
