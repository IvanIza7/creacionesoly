# Plan de Auditoría Final y Preparación RC (Release Candidate)

Este plan detalla las acciones técnicas que el equipo (Arquitectura, Seguridad, DevOps, QA) ejecutará en el código fuente para eliminar cualquier rastro del entorno de desarrollo y consolidar el proyecto como un Release Candidate puro.

## ⚠️ User Review Required

> [!WARNING]
> **Eliminación de Datos de Prueba (Mocks)**
> Al ejecutar este plan, se vaciarán los productos de demostración y las colecciones temporales del código fuente (`mockData.js`). El panel iniciará en blanco para que usted ingrese los datos reales. ¿Está de acuerdo con purgar los datos mock?

> [!CAUTION]
> **Bloqueo Estricto de Seguridad**
> Se restaurarán los límites contra ataques de fuerza bruta (ej. máximo 5 intentos de login cada 15 min). Si durante las pruebas excede este límite, será bloqueado temporalmente.

## Open Questions

1.  **Imágenes por defecto:** ¿Prefiere que los productos sin imagen muestren un cuadro gris minimalista con el logo de "JV GOLD" o un ícono genérico de joyería?
2.  **Hosting:** En la sección final del documento he incluido la recomendación de despliegue solicitada. ¿Tiene preferencia por AWS, Render, o un VPS tradicional como DigitalOcean?

---

## Proposed Changes

### 1. Eliminación de Dependencias de Desarrollo (Mocks)

Se purgarán los datos temporales para evitar que el estado inicial contamine la persistencia en producción.

#### [MODIFY] [mockData.js](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/src/data/mockData.js)
-   Se vaciará el arreglo `mockProducts = []`.
-   Se vaciará el arreglo `collections = []` en `initialCatalogs`.
-   Se dejarán únicamente las categorías y metadatos estructurales básicos (`genders`, `materials`, etc.) ya que son la semilla de los selectores, pero sin datos de clientes.

#### [MODIFY] [useStore.js](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/src/store/useStore.js)
-   Se actualizará la semilla inicial (`siteConfig`) para no depender de imágenes de Unsplash, utilizando URLs relativas o vacías.
-   Se cambiará la versión del almacenamiento persistente (`name: 'jv-gold-co-store-v7'`) para forzar una limpieza del caché antiguo en todos los navegadores al desplegar a producción.

---

### 2. Eliminación de Ethereal Email y Seguridad

El sistema no debe tener dependencias de Ethereal en producción. Si el administrador no ha configurado el SMTP oficial, el sistema debe fallar elegantemente de forma segura, no recurrir a correos de prueba.

#### [MODIFY] [mailer.js](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/backend/src/utils/mailer.js)
-   Se modificará `initMailer` para que **exija** las credenciales SMTP en `.env`.
-   Si no existen, se arrojará un error en los logs (para que DevOps lo detecte), pero la ejecución del servidor no se detendrá (para no tirar la página).
-   Se eliminará la generación de `testAccount` de Nodemailer.

#### [MODIFY] [server.js](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/backend/src/server.js)
-   Se restaurará el `rateLimit` de `authLimiter` de 100 a **5 intentos** por ventana de 15 minutos.
-   Se validará que Helmet esté configurado estrictamente.

---

### 3. Preparación de Imágenes y Fallbacks

Se implementará lógica defensiva en los componentes de interfaz para manejar productos sin imagen (ya que los mocks serán eliminados).

#### [MODIFY] [ProductCard.jsx](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/src/components/products/ProductCard.jsx)
-   Agregar un estado "fallback" (fondo oscuro premium con el nombre de la marca) si `product.image` es nulo o vacío.

#### [MODIFY] [CategoryCoverGrid.jsx](file:///C:/Users/ivani/OneDrive/Escritorio/jewelry-prime-project/src/components/collections/CategoryCoverGrid.jsx)
-   Agregar fallback genérico si la colección no tiene imagen subida.

---

## Verification Plan

### Automated / Backend
-   Correr el servidor backend y comprobar que `authLimiter` bloquee el sexto intento de login.
-   Comprobar que registrar un usuario sin `.env` arroje error en consola pero devuelva 200 OK al cliente (prevención de enumeración).

### Manual Verification
-   Abrir el frontend en una pestaña en incógnito y comprobar que el inventario carga en 0.
-   Comprobar que el Home se muestra sin errores (vacío o con fallbacks) listo para ser llenado desde el Panel Admin.

---

## Recomendación de Despliegue (Hosting Seguro)

Respondiendo a su pregunta: *"en donde me recomiendas desplegar este sitio que tenga seguro mis datos"*.

Dada la arquitectura (Frontend en React/Vite + Backend en Node.js + Base de Datos PostgreSQL + Almacenamiento Local de Imágenes), mi recomendación profesional es una **Arquitectura Híbrida en AWS (Amazon Web Services)** o una alternativa administrada como **Render.com**.

**Opción 1: Render.com (Recomendado por Simplicidad y Mantenimiento)**
-   **Frontend:** Despliegue estático automático.
-   **Backend (API):** Web Service que corre Node.js con un "Persistent Disk" adjunto para guardar la carpeta `/uploads` de manera segura y permanente.
-   **Base de Datos:** Render Managed PostgreSQL (backups automáticos diarios, cifrado en reposo).
-   *Beneficio:* Cero configuraciones de servidores (DevOps administrado).

**Opción 2: VPS Tradicional (DigitalOcean Droplet o AWS EC2)**
-   Instalar PM2 para manejar Node.js, Nginx como proxy reverso/SSL, y un contenedor de PostgreSQL.
-   *Beneficio:* Máximo control y menor costo a gran escala.
-   *Contra:* Requiere un administrador de sistemas para parchear Linux y mantener la seguridad.

Para este proyecto RC, recomiendo iniciar con **Render.com** (Web Service + Persistent Disk + Managed DB). Cumple con los más altos estándares de seguridad y quita la carga administrativa al equipo.
