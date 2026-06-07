-- Adds a separate "App Language" preference, independent from the existing
-- "News Language" preference (the column already mapped via @map("preferredLanguage")
-- on the renamed Prisma field `preferredNewsLanguage`).
ALTER TABLE "users" ADD COLUMN "preferredAppLanguage" "AppLocale" NOT NULL DEFAULT 'en';
