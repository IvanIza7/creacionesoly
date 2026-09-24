const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.businessSettings.update({
    where: { id: 'singleton' },
    data: {
      defaultWhatsappMessage: 'Hello. I would like to receive information about availability and pricing for the following products:'
    }
  });
  console.log('Database updated successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
