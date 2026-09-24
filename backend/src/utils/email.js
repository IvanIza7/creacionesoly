// In a real application, you would import the Resend SDK:
// const { Resend } = require('resend');
// const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
  
  console.log(`\n==============================================`);
  console.log(`[EMAIL SIMULATION] To: ${email}`);
  console.log(`Subject: Verifica tu cuenta en Creaciones Oly`);
  console.log(`Body: Por favor visita este enlace para verificar tu cuenta: \n${verifyUrl}`);
  console.log(`==============================================\n`);

  /*
  // Real implementation:
  await resend.emails.send({
    from: 'onboarding@resend.dev', // Cambiar por tu dominio verificado
    to: email,
    subject: 'Verifica tu cuenta en Creaciones Oly',
    html: `<p>Haz clic en este enlace para activar tu cuenta:</p><a href="${verifyUrl}">${verifyUrl}</a>`
  });
  */
};

module.exports = {
  sendVerificationEmail
};
