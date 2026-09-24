/**
 * seed-admin.js
 * 
 * Creates or updates the admin user based on environment variables.
 * 
 * Usage: node seed-admin.js
 * 
 * Configure credentials in .env:
 *   ADMIN_EMAIL=admin@admin.com
 *   ADMIN_PASSWORD=yourSecurePassword
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./src/utils/prisma');

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  console.log(`\n🔑 Seeding admin user: ${adminEmail}`);

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: 'admin',
      isVerified: true,
    },
    create: {
      name: 'Administrator',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isVerified: true,
    },
  });

  console.log(`✅ Admin user ready: ${admin.email} (role: ${admin.role})`);
  console.log(`\n⚠️  IMPORTANT: Change ADMIN_EMAIL and ADMIN_PASSWORD in .env before deploying to production!\n`);

  await prisma.$disconnect();
}

seedAdmin().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
