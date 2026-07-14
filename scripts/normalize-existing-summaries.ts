/* eslint-disable no-console */
/**
 * One-off backfill: re-applies `normalizeSummary()` to every already-stored
 * Article.summary/summaryFr/summaryRw and StoryCluster.canonicalSummary,
 * clamping any pre-existing bloated (20+ sentence / markdown-list) summaries
 * down to 5 sentences. Pure string cleanup — no LLM calls, no rate limits.
 *
 * Run with:
 *   npm run backfill:normalize-summaries -- --dry-run   (report only, no writes)
 *   npm run backfill:normalize-summaries                (apply changes)
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { normalizeSummary } from '../src/ai/summary-normalize.util';

const BATCH_SIZE = 500;
const SAMPLE_LIMIT = 5;

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set.');
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  console.log(dryRun ? 'DRY RUN — no writes will be made.' : 'LIVE RUN — changes will be written.');

  try {
    const articleStats = await normalizeArticles(prisma, dryRun);
    const clusterStats = await normalizeClusters(prisma, dryRun);

    console.log(
      `Articles: ${articleStats.changed}/${articleStats.scanned} rows ${dryRun ? 'would be updated' : 'updated'}.`,
    );
    console.log(
      `Story clusters: ${clusterStats.changed}/${clusterStats.scanned} rows ${dryRun ? 'would be updated' : 'updated'}.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function normalizeArticles(prisma: PrismaClient, dryRun: boolean) {
  let scanned = 0;
  let changed = 0;
  let sampled = 0;
  let cursor: string | undefined;

  for (;;) {
    const batch = await prisma.article.findMany({
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: 'asc' },
      where: {
        OR: [
          { summary: { not: null } },
          { summaryFr: { not: null } },
          { summaryRw: { not: null } },
        ],
      },
      select: { id: true, summary: true, summaryFr: true, summaryRw: true },
    });

    if (batch.length === 0) break;
    scanned += batch.length;

    for (const a of batch) {
      const next = {
        summary: a.summary ? normalizeSummary(a.summary) : a.summary,
        summaryFr: a.summaryFr ? normalizeSummary(a.summaryFr) : a.summaryFr,
        summaryRw: a.summaryRw ? normalizeSummary(a.summaryRw) : a.summaryRw,
      };

      const isChanged =
        next.summary !== a.summary ||
        next.summaryFr !== a.summaryFr ||
        next.summaryRw !== a.summaryRw;

      if (!isChanged) continue;
      changed++;

      if (dryRun && sampled < SAMPLE_LIMIT) {
        sampled++;
        logSample('article', a.id, a, next);
      }
      if (!dryRun) {
        await prisma.article.update({ where: { id: a.id }, data: next });
      }
    }

    cursor = batch[batch.length - 1].id;
    if (batch.length < BATCH_SIZE) break;
  }

  return { scanned, changed };
}

async function normalizeClusters(prisma: PrismaClient, dryRun: boolean) {
  let scanned = 0;
  let changed = 0;
  let sampled = 0;
  let cursor: string | undefined;

  for (;;) {
    const batch = await prisma.storyCluster.findMany({
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: 'asc' },
      where: { canonicalSummary: { not: null } },
      select: { id: true, canonicalSummary: true },
    });

    if (batch.length === 0) break;
    scanned += batch.length;

    for (const c of batch) {
      const next = c.canonicalSummary
        ? normalizeSummary(c.canonicalSummary)
        : c.canonicalSummary;

      if (next === c.canonicalSummary) continue;
      changed++;

      if (dryRun && sampled < SAMPLE_LIMIT) {
        sampled++;
        logSample('storyCluster', c.id, { canonicalSummary: c.canonicalSummary }, { canonicalSummary: next });
      }
      if (!dryRun) {
        await prisma.storyCluster.update({
          where: { id: c.id },
          data: { canonicalSummary: next },
        });
      }
    }

    cursor = batch[batch.length - 1].id;
    if (batch.length < BATCH_SIZE) break;
  }

  return { scanned, changed };
}

function logSample(
  table: string,
  id: string,
  before: Record<string, string | null>,
  after: Record<string, string | null>,
) {
  console.log(`\n--- ${table} ${id} ---`);
  for (const key of Object.keys(before)) {
    if (before[key] === after[key]) continue;
    console.log(`  ${key} BEFORE (${(before[key] ?? '').length} chars): ${before[key]}`);
    console.log(`  ${key} AFTER  (${(after[key] ?? '').length} chars): ${after[key]}`);
  }
}

main().catch((err) => {
  console.error('Backfill failed:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
