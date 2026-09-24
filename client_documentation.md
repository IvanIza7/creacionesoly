# Documentación del Cliente: Jewelry Prime

¡Bienvenido a tu nueva tienda en línea de Alta Relojería y Joyería! Este manual te explicará de forma sencilla cómo operar, mantener y proteger tu negocio digital.

---

## 1. Arquitectura y Tecnologías
Tu plataforma está construida utilizando las mejores y más modernas tecnologías de la industria:
- **Frontend (La Tienda Visual):** Construida con **React** y **Vite**. Es ultrarrápida y ofrece una experiencia similar a una aplicación móvil (SPA).
- **Backend (El Servidor/Cerebro):** Utiliza **Node.js** con **Express**.
- **Base de Datos:** **PostgreSQL**, gestionada a través de **Prisma ORM**, que previene errores humanos y ataques informáticos.
- **Seguridad:** Autenticación mediante **JWT (JSON Web Tokens)** almacenados en **Cookies HttpOnly**, lo cual blinda tu tienda contra robo de sesiones.

---

## 2. Manual de Administración del Panel (Site Editor e Inventario)

### ¿Cómo acceder al Panel?
1. Dirígete a la ruta segura de acceso: `tudominio.com/admin/login`
2. Ingresa con tu correo de administrador y contraseña. (Solo los correos con rol `admin` podrán entrar).

### ¿Cómo cambiar los textos, colores y el Logo de la tienda?
1. En el panel lateral, haz clic en **Editor de Sitio** (`/admin/editor`).
2. Tienes diferentes pestañas: **BRAND** (para nombre y logo), **HERO** (la gran imagen principal), **TEXTS** (textos de menús), etc.
3. Modifica los campos. Verás que hay un **límite de caracteres** para proteger el diseño visual.
4. Para el Logo y la foto principal, haz clic en el botón de "Elegir Archivo". Se abrirá un **Recortador Profesional**, donde podrás mover la imagen y darle zoom para encuadrarla perfectamente.
5. Haz clic en **SAVE CHANGES** abajo en el menú flotante para aplicar en vivo.

### ¿Cómo agregar o editar Productos en el Inventario?
1. Entra a la sección **Inventory** desde el panel de control.
2. Haz clic en el botón negro superior derecho **"Add Item"**.
3. Sube la foto (usa el recortador 1:1 cuadrado para que tu tienda luzca simétrica).
4. Llena los datos: Nombre, Categoría (Rings, Watches, etc.), Colección, y **Stock Current** (Unidades disponibles).
5. Si quieres que el producto aparezca en la portada, asegúrate de marcar la casilla **"Mark as New Arrival"**.

---

## 3. Mantenimiento Técnico y Seguridad (Para tu equipo de TI)

### Requisitos del Servidor (Hosting)
- Un VPS (Servidor Privado Virtual) como DigitalOcean, AWS EC2, o Railway.
- **Node.js** v18 o superior.
- **PostgreSQL** v14 o superior.

### Variables de Entorno (.env)
Asegúrate de que tu servidor tenga configuradas las siguientes claves (nunca las compartas):
- `DATABASE_URL`: La cadena de conexión a tu PostgreSQL.
- `JWT_SECRET`: Una cadena alfanumérica larga (ej. de 64 caracteres) usada para cifrar contraseñas.
- `FRONTEND_URL`: `https://tu-dominio.com`

### Cómo hacer respaldos (Backups) y Restaurar
Es vital configurar respaldos diarios de la base de datos PostgreSQL:
1. **Respaldo:** 
   `pg_dump -U tu_usuario -d jewelry_prime > backup_fecha.sql`
2. **Restaurar:** 
   `psql -U tu_usuario -d jewelry_prime < backup_fecha.sql`
*Recomendación:* Utilizar un servicio de Hosting gestionado (como Supabase o AWS RDS) que realice respaldos automáticos diarios.

### Cómo actualizar dependencias
Una vez al año, tu ingeniero de confianza debe correr los siguientes comandos para recibir los últimos parches de seguridad de React y Node.js:
1. Abrir la terminal en la carpeta del proyecto.
2. Ejecutar `npm audit` para revisar vulnerabilidades.
3. Ejecutar `npm update` para aplicar parches menores seguros.

### Renovación de Dominio y Hosting
- Tu dominio (`tudominio.com`) y hosting se alquilan anualmente.
- Se recomienda activar la **Renovación Automática** con tu proveedor de tarjetas de crédito o Namecheap/GoDaddy para que la tienda nunca se caiga. El proveedor siempre te notificará por email 30 días antes del vencimiento.

---

## 4. Buenas Prácticas Generales
- **Imágenes Pesadas:** Aunque el sistema tiene un límite de 2MB por foto para protegerse, intenta subir imágenes de menos de 500KB para que tu página web sea "Premium" y muy veloz en celulares.
- **Contraseñas Seguras:** El administrador siempre debe usar contraseñas de más de 12 caracteres (idealmente generadas con 1Password o Bitwarden).
- **Phishing:** Nunca ingreses a tu panel desde un correo electrónico sospechoso. Siempre tipea `tudominio.com/admin/login` directamente en el navegador.
