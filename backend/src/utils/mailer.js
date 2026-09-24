const nodemailer = require('nodemailer');

let transporter = null;

const initMailer = async () => {
  if (transporter) return;
  
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('✅ Nodemailer (SMTP de Producción) inicializado.');
    } else {
      console.log('⚠️ No se detectaron credenciales SMTP en el servidor. Modo simulación activo.');
    }
  } catch (err) {
    console.error('Error inicializando transportador de correo:', err);
  }
};

const sendConfirmationEmail = async (email, token, userName, businessSettings) => {
  try {
    if (!transporter) await initMailer();

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify?token=${token}`;
    const businessName = businessSettings?.businessName || 'Creaciones Oly';

    if (!transporter) {
      console.log(`[SIMULACIÓN EMAIL] Enlace de confirmación para ${email}: ${verifyUrl}`);
      return true;
    }
  
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-size: 24px;">
            ${businessName}
          </h1>
        </div>
        
        <div style="background-color: #fff; padding: 30px; border: 1px solid #eee;">
          <h2 style="color: #333; font-size: 20px; font-weight: normal; margin-top: 0;">Hola, ${userName}</h2>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Gracias por registrarte en nuestro catálogo digital. Para garantizar la seguridad de tu cuenta, necesitamos confirmar esta dirección de correo electrónico.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #d4af37; color: #fff; text-decoration: none; padding: 14px 28px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; display: inline-block;">
              Confirmar Correo Electrónico
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
            <a href="${verifyUrl}" style="color: #d4af37; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0;">
            Si no solicitaste crear esta cuenta, puedes ignorar este mensaje de forma segura.
          </p>
          <p style="color: #aaa; font-size: 11px; margin-top: 5px;">
            &copy; ${new Date().getFullYear()} ${businessName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;

    const senderEmail = process.env.CONTACT_EMAIL || 'no-reply@jvgold.com';
    const info = await transporter.sendMail({
      from: `"${businessName}" <${senderEmail}>`, 
      to: email, 
      subject: "Confirma tu correo electrónico", 
      text: `Hola ${userName}. Por favor confirma tu correo entrando a: ${verifyUrl}`, 
      html: htmlContent, 
    });

    console.log("-----------------------------------------");
    console.log("✉️  CORREO ENVIADO A: %s", email);
    console.log("👀 VISTA PREVIA DEL CORREO: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
    return true;
  } catch (error) {
    console.error("Error enviando correo de confirmación:", error);
    return false;
  }
};

const sendPasswordResetEmail = async (email, token, userName, businessSettings) => {
  try {
    if (!transporter) await initMailer();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const businessName = businessSettings?.businessName || 'Creaciones Oly';

    if (!transporter) {
      console.log(`[SIMULACIÓN EMAIL] Enlace de recuperación para ${email}: ${resetUrl}`);
      return true;
    }
  
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-size: 24px;">
            ${businessName}
          </h1>
        </div>
        
        <div style="background-color: #fff; padding: 30px; border: 1px solid #eee;">
          <h2 style="color: #333; font-size: 20px; font-weight: normal; margin-top: 0;">Hello, ${userName}</h2>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #d4af37; color: #fff; text-decoration: none; padding: 14px 28px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If the button doesn't work, copy and paste the following link into your browser:<br>
            <a href="${resetUrl}" style="color: #d4af37; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0;">
            This link will expire in 30 minutes for security reasons.
          </p>
          <p style="color: #aaa; font-size: 11px; margin-top: 5px;">
            &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const senderEmail = process.env.CONTACT_EMAIL || 'no-reply@jvgold.com';
    const info = await transporter.sendMail({
      from: `"${businessName}" <${senderEmail}>`, 
      to: email, 
      subject: "Password Reset Request", 
      text: `Hello ${userName}. Please reset your password by visiting: ${resetUrl}`, 
      html: htmlContent, 
    });

    console.log("-----------------------------------------");
    console.log("✉️  RECOVERY EMAIL SENT TO: %s", email);
    console.log("👀 PREVIEW EMAIL URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
    return true;
  } catch (error) {
    console.error("Error enviando correo de recuperación:", error);
    return false;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail
};
