-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
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
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_country_idx" ON "articles"("country");

-- CreateIndex
CREATE INDEX "articles_continent_idx" ON "articles"("continent");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");
