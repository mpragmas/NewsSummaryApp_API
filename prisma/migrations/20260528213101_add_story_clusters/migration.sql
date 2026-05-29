-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "clusterId" TEXT;

-- CreateTable
CREATE TABLE "story_clusters" (
    "id" TEXT NOT NULL,
    "canonicalTitle" TEXT NOT NULL,
    "canonicalSummary" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "continent" TEXT,
    "region" TEXT,
    "country" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "entityKeys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "titleTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceCount" INTEGER NOT NULL DEFAULT 0,
    "articleCount" INTEGER NOT NULL DEFAULT 0,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "leadArticleId" TEXT,
    "latestPublishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "story_clusters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "story_clusters_category_idx" ON "story_clusters"("category");

-- CreateIndex
CREATE INDEX "story_clusters_region_idx" ON "story_clusters"("region");

-- CreateIndex
CREATE INDEX "story_clusters_country_idx" ON "story_clusters"("country");

-- CreateIndex
CREATE INDEX "story_clusters_language_idx" ON "story_clusters"("language");

-- CreateIndex
CREATE INDEX "story_clusters_latestPublishedAt_idx" ON "story_clusters"("latestPublishedAt");

-- CreateIndex
CREATE INDEX "story_clusters_entityKeys_idx" ON "story_clusters" USING GIN ("entityKeys");

-- CreateIndex
CREATE INDEX "articles_clusterId_idx" ON "articles"("clusterId");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "story_clusters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
