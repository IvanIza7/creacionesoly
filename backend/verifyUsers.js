const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, isVerified: true, role: true }});
  console.log(users);
  
  // Force verify all unverified users so the user can test
  await prisma.user.updateMany({
    where: { isVerified: false },
    data: { isVerified: true, verificationTokenHash: null, verificationTokenExpires: null }
  });
  console.log('Todos los usuarios han sido verificados forzosamente para agilizar las pruebas.');
}
main().finally(() => prisma.$disconnect());
