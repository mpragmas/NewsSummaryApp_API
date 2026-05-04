-- CreateEnum
CREATE TYPE "AppLocale" AS ENUM ('en', 'fr');

-- AlterTable (preserve existing TEXT values: map anything other than 'fr' to en)
ALTER TABLE "users" ALTER COLUMN "preferredLanguage" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "preferredLanguage" TYPE "AppLocale" USING (
  CASE
    WHEN "preferredLanguage" = 'fr' THEN 'fr'::"AppLocale"
    ELSE 'en'::"AppLocale"
  END
);
ALTER TABLE "users" ALTER COLUMN "preferredLanguage" SET DEFAULT 'en'::"AppLocale";

-- CreateTable
CREATE TABLE "guest_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_saved_articles" (
    "id" TEXT NOT NULL,
    "guestSessionId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_saved_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_reading_history" (
    "id" TEXT NOT NULL,
    "guestSessionId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_sessions_createdAt_idx" ON "guest_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "guest_saved_articles_guestSessionId_idx" ON "guest_saved_articles"("guestSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "guest_saved_articles_guestSessionId_articleId_key" ON "guest_saved_articles"("guestSessionId", "articleId");

-- CreateIndex
CREATE INDEX "guest_reading_history_guestSessionId_idx" ON "guest_reading_history"("guestSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "guest_reading_history_guestSessionId_articleId_key" ON "guest_reading_history"("guestSessionId", "articleId");

-- AddForeignKey
ALTER TABLE "guest_saved_articles" ADD CONSTRAINT "guest_saved_articles_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_saved_articles" ADD CONSTRAINT "guest_saved_articles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_reading_history" ADD CONSTRAINT "guest_reading_history_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_reading_history" ADD CONSTRAINT "guest_reading_history_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
