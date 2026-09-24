require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function unlockAll() {
  const result = await prisma.user.updateMany({
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      isVerified: true
    }
  });
  console.log(`✅ Unlocked and verified ${result.count} users in Supabase.`);

  await prisma.businessSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      businessName: 'Creaciones Oly',
      whatsappNumber: '1234567890'
    }
  });
  console.log(`✅ BusinessSettings singleton verified.`);

  await prisma.$disconnect();
}

unlockAll().catch(e => {
  console.error(e);
  process.exit(1);
});
