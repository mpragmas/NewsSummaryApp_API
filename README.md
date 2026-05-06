# Global News Summarizer — Backend

NestJS + TypeScript + PostgreSQL + Redis + Gemini AI backend that ingests RSS feeds, deduplicates articles, AI-summarizes them in 5 sentences, and serves them via a paginated REST API.

---

## Architecture

```
src/
├── ai/                    # Gemini AI summarization (batched)
│   ├── ai.module.ts
│   └── ai.service.ts
├── articles/              # Core domain: CRUD, ingest pipeline
│   ├── dto/
│   │   ├── article-response.dto.ts
│   │   └── query-articles.dto.ts
│   ├── articles.controller.ts
│   ├── articles.module.ts
│   ├── articles.service.ts
│   ├── categorizer.service.ts    # Keyword-based category detection
│   └── deduplication.service.ts  # URL + Levenshtein title dedup
├── common/
│   ├── filters/http-exception.filter.ts
│   └── interceptors/response.interceptor.ts
├── config/configuration.ts
├── prisma/                # Global Prisma module
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── rss/                   # Feed fetching & normalization
│   ├── rss-feeds.config.ts
│   ├── rss.module.ts
│   └── rss.service.ts
├── scheduler/             # Every-30-min cron ingestion
│   ├── scheduler.module.ts
│   └── scheduler.service.ts
├── app.module.ts
└── main.ts
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| PostgreSQL | ≥ 14 |
| Redis | ≥ 7 |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/news_summarizer?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_key_from_aistudio.google.com
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

### 3. Create the database

```bash
createdb news_summarizer   # or use pgAdmin / psql
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start the server

```bash
# Development (hot-reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API is available at `http://localhost:3000/api/v1`.

---

## API Endpoints

All responses are wrapped:
```json
{ "success": true, "data": ..., "timestamp": "..." }
```

### GET /api/v1/articles

List articles (paginated, filterable).

| Query param | Type | Example |
|-------------|------|---------|
| `page` | number | `1` |
| `limit` | number | `20` (max 100) |
| `category` | string | `Technology` |
| `country` | string | `Rwanda` |
| `continent` | string | `Africa` |
| `source` | string | `BBC News` |
| `sortBy` | `publishedAt` \| `createdAt` | `publishedAt` |
| `order` | `asc` \| `desc` | `desc` |

```bash
curl "http://localhost:3000/api/v1/articles?category=Technology&limit=5"
curl "http://localhost:3000/api/v1/articles?country=Rwanda&page=1"
```

### GET /api/v1/articles/:id

Fetch a single article by UUID.

```bash
curl "http://localhost:3000/api/v1/articles/uuid-here"
```

### POST /api/v1/articles/ingest

Manually trigger the ingestion pipeline. Articles are fetched, deduplicated,
categorized, and persisted SYNCHRONOUSLY. AI summarization is then **enqueued**
on the BullMQ `summarization` queue and runs in the background — the HTTP
request returns immediately even if the LLM providers are rate-limited.

```bash
curl -X POST "http://localhost:3000/api/v1/articles/ingest" \
  -H "X-Admin-Key: $ADMIN_API_KEY"
```

Response:
```json
{ "success": true, "data": { "processed": 87, "saved": 34, "enqueued": 34 } }
```

### GET /api/v1/articles/processing-status

Live snapshot of the summarization queue and provider state. Useful for
observability: queue depth, failed jobs, active provider cooldowns.

```bash
curl "http://localhost:3000/api/v1/articles/processing-status"
```

```json
{
  "queue": { "wait": 12, "active": 2, "delayed": 0, "failed": 0, "completed": 311 },
  "providers": {
    "groq":   { "enabled": true, "model": "llama-3.1-8b-instant", "cooldownActive": false, "cooldownUntil": null, "cooldownReason": null },
    "gemini": { "enabled": true, "model": "gemini-2.0-flash",     "cooldownActive": false, "cooldownUntil": null, "cooldownReason": null },
    "fallback": { "enabled": true, "model": "local-deterministic" }
  }
}
```

---

## AI summarization — rate limiting & queue (production architecture)

The system used to call Groq → Gemini → fallback **inline** during ingest.
For 200–300 articles per run that produced 429 storms on both providers.

The new pipeline:

```
ingest()
  ├─ fetch (RSS + scrapers)         (parallel, fast)
  ├─ deduplicate                    (in-memory + DB)
  ├─ categorize                     (keyword matcher)
  ├─ persist Article rows           (createMany, summary = NULL)
  └─ enqueue 1 BullMQ job per row   ← returns to caller HERE

[summarization-queue worker] (concurrency = SUMMARIZATION_CONCURRENCY)
  ├─ SummaryCacheService.get(sha256(title+content+lang))    ← Redis hit ⇒ skip AI
  ├─ AiOrchestratorService.summarize(input)
  │     ├─ GroqProvider    (Bottleneck: GROQ_RPM + GROQ_TPM reservoir)
  │     │     on 429 → start provider cooldown for `Retry-After` seconds
  │     ├─ GeminiProvider  (Bottleneck: GEMINI_RPM + GEMINI_TPM reservoir)
  │     │     on 429 → start provider cooldown
  │     └─ FallbackProvider (deterministic local — never throws)
  └─ Prisma.update({ summary | summaryFr | summaryRw })
```

Key guarantees:

1. **Per-provider request + token reservoirs** (Bottleneck). Each call
   pre-pays its estimated token cost before the request leaves the process,
   so 200 jobs cannot blow past `GROQ_TPM` (default 5500/min).
2. **Provider cooldown** — when a 429 (or quota) comes back, that provider
   is parked for the `Retry-After` window the API gave us. The orchestrator
   skips it and tries the next provider. No rapid ping-pong.
3. **BullMQ exponential backoff** — failed jobs retry with exponential
   delay (`SUMMARIZATION_ATTEMPTS`, `SUMMARIZATION_BACKOFF_MS`).
4. **Content-hash cache** (`ai:summary:v1:<sha256>`, TTL 7 d) — re-running
   ingest does NOT re-summarize the same headlines.
5. **Idempotent jobs** — BullMQ `jobId = articleId:field`, so two ingests
   queued back-to-back collapse to one job.
6. **Always-non-NULL summaries** — when all retries are exhausted the
   worker writes the local deterministic fallback rather than leaving the
   row blank.

### Environment knobs

| Var | Default | Purpose |
|---|---|---|
| `GROQ_RPM` / `GROQ_TPM` | 25 / 5500 | Groq req+token per minute |
| `GEMINI_RPM` / `GEMINI_TPM` | 12 / 800000 | Gemini req+token per minute |
| `SUMMARIZATION_CONCURRENCY` | 2 | Parallel BullMQ workers |
| `SUMMARIZATION_ATTEMPTS` | 5 | Max retries per article |
| `SUMMARIZATION_BACKOFF_MS` | 4000 | Exponential backoff base |

> Tune `*_RPM` / `*_TPM` to stay UNDER your plan ceiling. Free tiers as of
> Apr 2026: Groq llama-3.1-8b-instant 30 RPM / 6000 TPM; Gemini 2.0 Flash
> 15 RPM / ~1M TPM.

---

## Categories

Auto-detected via keyword matching:
`Politics`, `Business`, `Technology`, `Health`, `Sports`, `Entertainment`, `Science`, `Conflict`, `General`

---

## RSS Sources

| Source | Region |
|--------|--------|
| BBC News | UK / Global |
| BBC World | Global |
| Al Jazeera | Middle East |
| AllAfrica | Africa |
| The East African | East Africa |
| The New Times | Rwanda |
| KT Press | Rwanda |
| Reuters | Global / US |
| TechCrunch | Tech / US |

---

## Useful Commands

```bash
npm run db:migrate    # Run new migrations
npm run db:deploy     # Apply migrations in production
npm run db:generate   # Regenerate Prisma client
npm run db:studio     # Open Prisma Studio (GUI)
npm run build         # Compile TypeScript
npm run start:dev     # Dev with hot-reload
```

---

## Notes

- The scheduler triggers automatically every 30 minutes via `@Cron`.
- Redis caches article list responses for 30 minutes; cache is cleared on each ingestion.
- AI summarization runs through a BullMQ queue with per-provider Bottleneck
  rate limiting, content-hash cache, and exponential backoff retries.
- Deduplication uses exact URL matching + Levenshtein title similarity (≥75% = duplicate).
