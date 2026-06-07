import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const user = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!user) {
      console.log('FAIL: no user with username "admin"');
      return;
    }
    console.log('User:', { id: user.id, role: user.role, hasHash: !!user.passwordHash });
    const ok = user.passwordHash
      ? await bcrypt.compare('GNS@2026!', user.passwordHash)
      : false;
    console.log('Password "GNS@2026!" matches:', ok);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
