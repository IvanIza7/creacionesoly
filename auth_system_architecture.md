# Diseño del Sistema de Autenticación - JV GOLD & CO LLC

Este documento establece la arquitectura completa, flujos y justificaciones técnicas para el sistema de autenticación de JV GOLD & CO LLC. Su diseño está basado en **OWASP Top 10**, **OWASP ASVS** y las recomendaciones **NIST Digital Identity Guidelines (SP 800-63B)**.

---

## 1. Arquitectura General

El sistema utilizará una arquitectura cliente-servidor con una API RESTful stateless. La sesión se gestionará mediante **JSON Web Tokens (JWT)** asimétricos o firmados con HMAC-SHA256, utilizando una estrategia Dual-Token (Access Token de corta duración + Refresh Token de larga duración y revocable).

### Flujo Completo
1. **Registro:** El usuario envía credenciales seguras. El backend realiza el hash de la contraseña, almacena el usuario con estado `isVerified: false` y genera un token único temporal (UUID v4 o Token Criptográfico).
2. **Correo de Confirmación:** Se envía un correo asíncrono vía proveedor (Resend/SendGrid) con un enlace de confirmación único (un solo clic).
3. **Confirmación de Cuenta:** El usuario hace clic en el enlace. El servidor valida el token, actualiza `isVerified: true`, invalida el token y muestra mensaje de éxito.
4. **Inicio de Sesión:** El usuario ingresa credenciales. El backend valida el hash, verifica si `isVerified: true`. Si es correcto, genera AccessToken (en memoria/cookie) y RefreshToken (en HTTPOnly Cookie seguro).
5. **Recuperación de Contraseña:** Solicitud con email. Si existe, se genera un token de un solo uso de corta vida. Se envía enlace por correo.
6. **Cambio de Contraseña:** Al consumir el enlace, el usuario establece nueva contraseña. Se invalidan todos los RefreshTokens activos para forzar el cierre de sesiones.
7. **Cierre de Sesión:** El frontend elimina el estado y solicita al backend que elimine/revoque el RefreshToken de la base de datos y limpie las cookies.

*Justificación:* El patrón Dual-Token mitiga riesgos de XSS y CSRF al utilizar cookies HTTPOnly `SameSite=Strict` para el RefreshToken, mientras mantiene alto rendimiento en la API.

---

## 2. Registro

**Formulario Frontend:**
- Nombre, Apellidos (opcional)
- Correo Electrónico
- Contraseña y Confirmar Contraseña
- Checkbox: Aceptación de Términos, Condiciones y Privacidad.

**Validaciones (Frontend y Backend):**
- **Correo:** Regex estricto (RFC 5322). Comprobación de no existencia (prevención de enumeración controlada mediante mensajes genéricos).
- **Contraseña:** Mínimo 12 caracteres (Recomendación NIST). Validación contra bases de datos de contraseñas filtradas (opcional en fase inicial, preparado arquitectónicamente).
- **Tasa de Registro:** Rate limiting basado en IP para evitar creación de cuentas fantasma mediante bots.

*Justificación:* Requerir 12 caracteres mitiga enormemente la viabilidad de ataques por fuerza bruta o diccionarios sin exigir reglas complejas y frustrantes (como "1 símbolo y 1 mayúscula" que NIST ya desaconseja por afectar usabilidad).

---

## 3. Confirmación de Correo (Double Opt-In Híbrido)

- **Generación de Token:** Hash criptográfico (`crypto.randomBytes(32).toString('hex')`). Almacenado como hash (SHA-256) en la BD para evitar exposición en caso de brecha (OWASP).
- **TTL (Time to Live):** 24 horas.
- **Acción (Un clic):** El enlace en el correo apunta a `/auth/verify?token=XYZ`. El frontend recibe el parámetro e invoca la API (GET /api/auth/verify). 
- **Flujo Expirado:** Si el token expira, el usuario intenta loguearse y el sistema detecta cuenta no validada, ofreciendo un botón: "Reenviar correo de confirmación".

*Justificación:* Reducimos el fraude, evitamos registros automatizados y cumplimos normativas GDPR/CCPA. El mecanismo de un solo clic mejora drásticamente la tasa de conversión en comparación con copiar/pegar códigos.

---

## 4. Diseño del Correo Electrónico

La plantilla de correo se construirá con MJML para garantizar perfecta renderización en clientes obsoletos (Outlook, Apple Mail, Gmail web/móvil).

**Estructura Visual:**
1. **Cabecera:** Logotipo de JV GOLD & CO LLC sobre fondo oscuro (Premium).
2. **Cuerpo (Fondo Blanco):** 
   - Saludo: "Hola [Nombre],"
   - Mensaje: "Gracias por registrarte en nuestro catálogo digital. Para garantizar la seguridad de tu cuenta, necesitamos confirmar esta dirección de correo."
   - Botón Principal (Accent Color): "Confirmar correo electrónico"
   - Fallback text: "Si el botón no funciona, copia y pega este enlace: https://midominio.com/auth/verify?token=XYZ"
3. **Pie de Página:**
   - Aviso de seguridad: "Si no solicitaste crear esta cuenta, puedes ignorar este mensaje de forma segura."
   - Datos legales y de contacto del negocio (Teléfono, Email público).

*Justificación:* Una identidad visual fuerte y cuidada mantiene la confianza del cliente, vital en la industria de la joyería. El enlace de fallback es necesario para clientes de correo empresariales muy restrictivos.

---

## 5. Inicio de Sesión

**Flujo:**
- Email y Contraseña.
- Sin botones de "Recordarme" (sesión persistente automática vía Refresh Token por 30 días, Access Token de 15 minutos).

**Protecciones Implementadas:**
- **Rate Limiting (Fuerza Bruta):** Bloqueo (Account Lockout) tras 5 intentos fallidos por 15 minutos, combinado con retrasos progresivos.
- **Enumeración de Usuarios:** Respuestas idénticas en tiempos (timing attacks mitigated via constant-time comparators) y mensajes ("Credenciales inválidas" en lugar de "El usuario no existe").
- **Protección de Sesión:** Cookies configuradas como `HttpOnly, Secure, SameSite=Strict`.

*Justificación:* Las defensas proactivas contra fuerza bruta son obligatorias por NIST SP 800-63B. 

---

## 6. Recuperación de Contraseña

**Flujo:**
1. Usuario introduce correo.
2. Servidor genera Token único de corta duración (30 minutos) y lo guarda hasheado en BD.
3. Servidor responde de manera genérica: "Si tu correo existe en nuestro sistema, hemos enviado un enlace de recuperación." (Previene enumeración de correos).
4. El enlace redirige a una pantalla de "Nueva Contraseña". Se pide la nueva contraseña 2 veces. No se pide la actual.
5. Tras el cambio, se revocan los `tokenVersion` o se eliminan todos los `Session` del usuario.

*Justificación:* Invalidar las sesiones tras un restablecimiento protege la cuenta en caso de que un tercero hubiera vulnerado un equipo previamente autorizado.

---

## 7. Roles y Permisos

La tabla de base de datos define `role: String` (o Enum).
- **`admin`**: Cuenta del propietario. Control total. Puede ver configuraciones, editar negocio, modificar productos de catálogo.
- **`client`**: Cuenta de visitante. Su login no lo redirige al panel administrativo, sino que lo mantiene en el catálogo con permisos de: "Crear Wishlist", "Ver Favoritos", "Iniciar Checkout/Cotización WhatsApp".

*Justificación:* El enfoque de RBAC (Role-Based Access Control) con 2 perfiles simplifica la gestión mientras sella las rutas del Panel Administrativo de visitantes comunes.

---

## 8. Panel Administrativo (Configuración del Negocio)

La tabla `BusinessSettings` utiliza un patrón `Singleton` (única fila id='singleton').
Aquí se configuran los correos y URLs dinámicas sin tocar código.
- Los secretos de SMTP (Contraseña, API Key, Client Secrets) **SIEMPRE** residen en `.env` (o Vault de AWS/GCP). NUNCA en la base de datos de la app.

*Justificación:* Guardar claves en BD violaría políticas críticas de seguridad. Un compromiso de la base de datos por inyección no debe otorgar control a infraestructura externa (Ej. Proveedor de Correos).

---

## 9. Base de Datos (PostgreSQL via Prisma)

**Tablas Principales:**

1. **`User`**
   - `id`: UUID (PK)
   - `email`: String (Unique)
   - `passwordHash`: String (bcrypt)
   - `role`: String (admin/client)
   - `isVerified`: Boolean (Default false)
   - `verificationTokenHash` / `verificationExpires`: String / DateTime
   - `resetTokenHash` / `resetExpires`: String / DateTime
   - `failedLoginAttempts`: Int
   - `lockedUntil`: DateTime

2. **`Session`**
   - `id`: UUID (PK)
   - `userId`: Relación a User
   - `refreshTokenHash`: String
   - `expiresAt`: DateTime

3. **`BusinessSettings`** (Patrón Singleton)
   - `id` (PK, val: 'singleton')
   - Parámetros comerciales (WhatsApp, Nombre, etc).

*Justificación:* Utilizar claves subrogadas (UUID) previene la predicción de IDs. La entidad `Session` permite observar y matar sesiones remotas (Ej. Un usuario revoca el acceso de un celular perdido).

---

## 10. Seguridad - OWASP Top 10 Defenses

1. **Inyección (SQL/NoSQL):** Prisma ORM utiliza consultas parametrizadas internamente.
2. **Autenticación Rota:** Sessions manejadas bajo estrictas reglas NIST. Uso de `tokenVersion`.
3. **XSS (Cross-Site Scripting):** React maneja automáticamente el escape de HTML en el frontend. Las Cookies HttpOnly impiden que JS malicioso robe el JWT.
4. **CSRF:** JWT Access token via memoria o cabecera `Authorization: Bearer`, o si usa cookies: SameSite=Strict / SameSite=Lax.
5. **Session Fixation:** Al loguearse exitosamente, se genera un identificador de sesión completamente nuevo.

---

## 11. Experiencia del Usuario (Mensajes del UI)

- **Registro exitoso:** "Hemos enviado un correo a `tu@email.com`. Por favor, haz clic en el enlace para confirmar tu cuenta."
- **Correo Confirmado:** "¡Cuenta activada con éxito! Redirigiendo..."
- **Error Login (No verificado):** "Tu cuenta aún no está confirmada. Verifica tu correo electrónico. [Reenviar confirmación]"
- **Credenciales Incorrectas:** "Correo electrónico o contraseña incorrectos." (Nunca especificar cuál falló).

---

## 12. Accesibilidad

- Todos los `input` contarán con atributos `aria-label` o `label` explícitos.
- Navegación lógica mediante Tabulador sin bloqueos (`tabindex`).
- Contraste WCAG AAA en colores del botón de login (negro/blanco/oro).

---

## 13. Escalabilidad y Futuro

La base de datos actual soporta la transición fluida a:
- **OAuth (Google/Apple):** Añadiendo un modelo `OAuthProvider` enlazado a `User`.
- **Lista de Deseos / Pedidos:** Relacionando una tabla `Order` o `Wishlist` al `UserId`.
- El uso de JWT permite escalar el backend horizontalmente sin depender de una memoria de estado (Redis) para la mayoría de validaciones (aunque Redis sería útil para blacklist en fase enterprise).

---

## 14. Casos de Prueba (QA)

1. Registro de un usuario nuevo con contraseña válida (espera: Exito, envío de email).
2. Intento de inicio de sesión de usuario sin confirmar (espera: Bloqueo, mensaje de cuenta inactiva).
3. Consumo de un enlace expirado (espera: Error "Enlace caducado", opción de reenvío).
4. Solicitud de recuperación de contraseña con email inexistente (espera: Falso éxito simulado en UI, sin filtrado de info).
5. Inicio de sesión exitoso crea cookies HTTPOnly (espera: Validación en Herramientas de Desarrollador).
6. Ruta `/admin` bloqueada para usuarios con rol `client` (espera: Redirect o 403 Forbidden).

---

## 15. Recomendaciones Estratégicas y Checklist Priorizado

- **PRIORIDAD CRÍTICA:**
  - Migrar los endpoints actuales a usar cookies HttpOnly para el RefreshToken.
  - Implementar el bloqueo de cuenta (`failedLoginAttempts`) inmediatamente para evitar ataques de fuerza bruta al lanzamiento.
- **PRIORIDAD ALTA:**
  - Implementar el diseño HTML del correo en MJML, para asegurar que no aterrice en la bandeja de spam.
  - Habilitar autenticación de dominio SMTP (SPF, DKIM, DMARC) con el proveedor antes del lanzamiento (Email Deliverability).
- **PRIORIDAD MEDIA:**
  - Ocultar la palabra "Panel Administrativo" en el frontend para evitar confusión (los clientes usan la misma pantalla).
- **PRIORIDAD BAJA:**
  - Dashboard para que el usuario normal vea su perfil y cambie su nombre.

---
*Este documento ha sido diseñado siguiendo las pautas de un equipo de Ingeniería de Software de clase mundial, preparado para despliegue en entornos de alta exigencia comercial.*
