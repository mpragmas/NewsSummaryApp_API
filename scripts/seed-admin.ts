/* eslint-disable no-console */
/**
 * Provisions (or updates) the single pre-seeded admin account.
 *
 * Admin accounts are never created via signup or Google sign-in — this script
 * is the only supported way to provision one. Run with:
 *   npm run seed:admin -- [username] [password]
 *
 * Defaults to `admin` / `GNS@2026!` when no arguments are given. The password
 * is hashed with bcrypt before being stored — it is never logged or persisted
 * in plaintext. Change it after first login.
 */
import 'dotenv/config';
import { PrismaClient, Role } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'GNS@2026!';

async function main() {
  const username = (process.argv[2] ?? DEFAULT_USERNAME).trim();
  const password = process.argv[3] ?? DEFAULT_PASSWORD;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Add it to backend/.env (Neon connection string) and retry.',
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
      where: { username },
      update: { passwordHash, role: Role.admin },
      create: { username, passwordHash, role: Role.admin, name: 'Admin' },
      select: { id: true, username: true, role: true },
    });

    console.log(`Admin account ready: username="${user.username}" role=${user.role} id=${user.id}`);
    console.log('Password hashed and stored — sign in and change it from the profile page.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
