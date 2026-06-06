-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('STORY_IMPRESSION', 'ARTICLE_OPEN', 'SOURCE_SWITCH', 'EXTERNAL_CLICK', 'BOOKMARK', 'UNBOOKMARK', 'SHARE', 'SEARCH', 'SESSION_START', 'SESSION_HEARTBEAT', 'LANGUAGE_USAGE', 'CATEGORY_INTEREST', 'REGION_INTEREST');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('mobile', 'tablet', 'desktop', 'bot', 'unknown');

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "articleId" TEXT,
    "clusterId" TEXT,
    "source" TEXT,
    "category" TEXT,
    "language" TEXT,
    "country" TEXT,
    "region" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'unknown',
    "referrer" TEXT,
    "query" TEXT,
    "resultCount" INTEGER,
    "durationMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "anonId" TEXT NOT NULL,
    "userId" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'unknown',
    "country" TEXT,
    "region" TEXT,
    "referrer" TEXT,
    "language" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "pageviews" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_impressions" (
    "id" TEXT NOT NULL,
    "clusterId" TEXT,
    "articleId" TEXT,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "source" TEXT,
    "category" TEXT,
    "language" TEXT,
    "country" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_impressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_clicks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "clusterId" TEXT,
    "source" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "device" "DeviceType" NOT NULL DEFAULT 'unknown',
    "country" TEXT,
    "region" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher_daily_stats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "publisher" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "opens" INTEGER NOT NULL DEFAULT 0,
    "uniqueSessions" INTEGER NOT NULL DEFAULT 0,
    "uniqueUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publisher_daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");
CREATE INDEX "analytics_events_source_idx" ON "analytics_events"("source");
CREATE INDEX "analytics_events_articleId_idx" ON "analytics_events"("articleId");
CREATE INDEX "analytics_events_userId_idx" ON "analytics_events"("userId");
CREATE INDEX "analytics_events_sessionId_idx" ON "analytics_events"("sessionId");
CREATE INDEX "analytics_events_clusterId_idx" ON "analytics_events"("clusterId");
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");
CREATE INDEX "analytics_events_category_createdAt_idx" ON "analytics_events"("category", "createdAt");

-- CreateIndex
CREATE INDEX "user_sessions_anonId_idx" ON "user_sessions"("anonId");
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");
CREATE INDEX "user_sessions_startedAt_idx" ON "user_sessions"("startedAt");
CREATE INDEX "user_sessions_lastSeenAt_idx" ON "user_sessions"("lastSeenAt");

-- CreateIndex
CREATE INDEX "story_impressions_createdAt_idx" ON "story_impressions"("createdAt");
CREATE INDEX "story_impressions_clusterId_idx" ON "story_impressions"("clusterId");
CREATE INDEX "story_impressions_articleId_idx" ON "story_impressions"("articleId");
CREATE INDEX "story_impressions_sessionId_idx" ON "story_impressions"("sessionId");
CREATE INDEX "story_impressions_source_idx" ON "story_impressions"("source");
CREATE INDEX "story_impressions_source_createdAt_idx" ON "story_impressions"("source", "createdAt");

-- CreateIndex
CREATE INDEX "external_clicks_createdAt_idx" ON "external_clicks"("createdAt");
CREATE INDEX "external_clicks_source_idx" ON "external_clicks"("source");
CREATE INDEX "external_clicks_articleId_idx" ON "external_clicks"("articleId");
CREATE INDEX "external_clicks_userId_idx" ON "external_clicks"("userId");
CREATE INDEX "external_clicks_sessionId_idx" ON "external_clicks"("sessionId");
CREATE INDEX "external_clicks_source_createdAt_idx" ON "external_clicks"("source", "createdAt");

-- CreateIndex
CREATE INDEX "publisher_daily_stats_date_idx" ON "publisher_daily_stats"("date");
CREATE INDEX "publisher_daily_stats_publisher_idx" ON "publisher_daily_stats"("publisher");
CREATE UNIQUE INDEX "publisher_daily_stats_date_publisher_key" ON "publisher_daily_stats"("date", "publisher");
