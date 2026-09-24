const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const password = 'admin'; // Contraseña super básica para pruebas

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log('El administrador ya existe.');
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      passwordHash,
      role: 'admin',
      isVerified: true
    }
  });

  console.log('Usuario administrador creado exitosamente.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
