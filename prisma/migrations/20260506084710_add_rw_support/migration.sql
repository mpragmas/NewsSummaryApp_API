-- CreateEnum
CREATE TYPE "AppLocale" AS ENUM ('en', 'fr', 'rw');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT,
    "email" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "preferredLanguage" "AppLocale" NOT NULL DEFAULT 'en',
    "favoriteTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dailyDigest" BOOLEAN NOT NULL DEFAULT false,
    "breakingNews" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "saved_articles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "summaryFr" TEXT,
    "summaryRw" TEXT,
    "imageUrl" TEXT,
    "originalLanguage" TEXT NOT NULL DEFAULT 'en',
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT,
    "continent" TEXT,
    "region" TEXT,
    "country" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUid_key" ON "users"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

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

-- CreateIndex
CREATE INDEX "saved_articles_userId_idx" ON "saved_articles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_articles_userId_articleId_key" ON "saved_articles"("userId", "articleId");

-- CreateIndex
CREATE INDEX "reading_history_userId_idx" ON "reading_history"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_history_userId_articleId_key" ON "reading_history"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_country_idx" ON "articles"("country");

-- CreateIndex
CREATE INDEX "articles_continent_idx" ON "articles"("continent");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_region_idx" ON "articles"("region");

-- CreateIndex
CREATE INDEX "articles_originalLanguage_idx" ON "articles"("originalLanguage");

-- AddForeignKey
ALTER TABLE "guest_saved_articles" ADD CONSTRAINT "guest_saved_articles_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_saved_articles" ADD CONSTRAINT "guest_saved_articles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_reading_history" ADD CONSTRAINT "guest_reading_history_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_reading_history" ADD CONSTRAINT "guest_reading_history_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_articles" ADD CONSTRAINT "saved_articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_articles" ADD CONSTRAINT "saved_articles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
