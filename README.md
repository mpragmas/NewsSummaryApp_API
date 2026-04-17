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

Manually trigger the full ingestion pipeline (fetch → deduplicate → categorize → summarize → save).

```bash
curl -X POST "http://localhost:3000/api/v1/articles/ingest"
```

Response:
```json
{ "success": true, "data": { "processed": 87, "saved": 34 } }
```

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
- Summaries are generated in batches of 5 with retry logic (3 attempts, exponential backoff).
- Deduplication uses exact URL matching + Levenshtein title similarity (≥75% = duplicate).
