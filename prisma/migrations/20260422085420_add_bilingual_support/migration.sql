-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "originalLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "summaryFr" TEXT;

-- CreateIndex
CREATE INDEX "articles_originalLanguage_idx" ON "articles"("originalLanguage");
