# Plan de Implementación: Subida de Imágenes y Límites de Texto

Este plan aborda la necesidad de subir imágenes desde el dispositivo (con recorte/alineación) y añadir contadores de caracteres en los formularios para mantener la base de datos optimizada y prevenir errores.

## User Review Required

> [!IMPORTANT]
> **Almacenamiento de Imágenes:** 
> El estándar moderno para producción es usar un servicio en la nube (como Cloudinary o AWS S3). Sin embargo, para empezar rápido y cumplir con "subir localmente", **implementaré un sistema local usando `multer`**. Las imágenes se guardarán en una carpeta `uploads/` dentro del backend y el servidor las enviará al frontend. ¿Estás de acuerdo con este enfoque local para empezar?

> [!TIP]
> **Recomendaciones de Estándar para Imágenes:**
> - **Peso límite:** Recomiendo un máximo de **2 MB** por imagen. Las imágenes más pesadas hacen que la página cargue lento y perjudican el SEO.
> - **Formatos permitidos:** JPEG, PNG y WebP.
> - **Dimensiones sugeridas:** Para productos (1:1 cuadrado, ej. 800x800px), para el Hero de la portada (16:9 panorámico, ej. 1920x1080px).

## Open Questions

1. Para la herramienta de recorte de imágenes, ¿te gustaría que obliguemos al administrador a recortar la imagen en un formato específico (por ejemplo, que los productos *siempre* sean un cuadrado perfecto 1:1) para mantener el diseño impecable, o prefieres que tengan libertad de tamaño? (Recomiendo forzar el formato 1:1 para productos).

## Proposed Changes

### 1. Backend: Sistema de Subida (Uploads)
#### [NEW] [backend/src/routes/upload.routes.js] & [backend/src/middlewares/upload.js]
- Instalaremos el paquete `multer`.
- Crearemos un middleware para interceptar las imágenes, validar que pesen menos de 2MB y que sean formatos válidos.
- Crearemos el endpoint `POST /api/upload` que recibirá la imagen y devolverá la URL local (ej. `http://localhost:4000/uploads/imagen.jpg`).
#### [MODIFY] [backend/src/server.js]
- Añadiremos Express Static para poder servir públicamente la carpeta `/uploads`.

### 2. Frontend: Recortador de Imágenes (Cropper)
#### [NEW] [src/components/ui/ImageCropper.jsx]
- Instalaremos la librería `react-easy-crop`.
- Crearemos un componente modal (ventana emergente) donde el administrador subirá la imagen, verá una vista previa con una cuadrícula, podrá hacer zoom, moverla y recortarla exactamente como quiere que se vea antes de enviarla al servidor.

### 3. Frontend: Integración en Formularios (Imágenes y Textos)
#### [MODIFY] [src/pages/admin/SiteEditor.jsx] & [src/pages/admin/Inventory.jsx]
- Reemplazaremos los campos donde actualmente se pegan URLs de imágenes por nuestro nuevo componente `ImageCropper`.
- Añadiremos propiedades `maxLength` a los campos de texto (ej. Títulos max 50 caracteres, Descripciones max 255).
- Crearemos un indicador visual pequeño debajo de cada campo de texto que diga "Caracteres restantes: X" que se pondrá rojo si se acercan al límite.

## Verification Plan
1. Ejecutaremos el backend y frontend.
2. Entraremos al Site Editor e intentaremos subir una imagen pesada (>2MB) para comprobar el bloqueo.
3. Subiremos una imagen válida, usaremos el recortador para elegir la mejor parte y guardaremos los cambios.
4. Escribiremos un texto largo en los títulos para ver cómo el contador de caracteres funciona y nos detiene al llegar al límite.
