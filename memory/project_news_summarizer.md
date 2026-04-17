---
name: Global News Summarizer backend
description: NestJS backend for Global News Summarizer — architecture, stack, and key design decisions
type: project
---

Production NestJS backend for a Global News Summarizer app. Stack: NestJS 11, TypeScript, PostgreSQL (Prisma 7 + @prisma/adapter-pg), Redis (cache-manager v7 + @keyv/redis), Gemini 1.5 Flash AI.

**Why:** User requested full production-ready backend with RSS ingestion, AI summarization, deduplication, caching, scheduler.

**How to apply:** When the user asks to extend features, use these modules as reference: articles, rss, ai, scheduler, prisma, common. All endpoints are under `/api/v1`. Prisma 7 requires `@prisma/adapter-pg` passed to the PrismaClient constructor — `url` is NOT in schema.prisma, it's in `prisma.config.ts`.
