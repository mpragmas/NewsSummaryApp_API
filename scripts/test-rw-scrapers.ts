/* eslint-disable no-console */
/**
 * Manual smoke test for the Kinyarwanda scrapers. Run with:
 *   npx ts-node-dev --transpile-only scripts/test-rw-scrapers.ts
 * (no Nest, no DB; uses the same scraper code as production).
 */
import { Logger } from '@nestjs/common';
import { scrapeIgihe } from '../src/scrapers/igihe.scraper';
import { scrapeKigaliToday } from '../src/scrapers/kigalitoday.scraper';

const logger = new Logger('rw-scrape-test');

async function main() {
  console.log('--- IGIHE ---');
  const igihe = await scrapeIgihe(logger);
  console.log(
    `accepted=${igihe.articles.length} scraped=${igihe.scrapedTotal} ` +
      `rejectedInvalid=${igihe.rejectedInvalid} rejectedLowQuality=${igihe.rejectedLowQuality}`,
  );
  for (const a of igihe.articles.slice(0, 3)) {
    console.log({
      title: a.title,
      contentLen: a.content.length,
      url: a.url,
      img: a.imageUrl?.slice(0, 80) ?? null,
      publishedAt: a.publishedAt,
    });
  }

  console.log('\n--- KIGALI TODAY ---');
  const kt = await scrapeKigaliToday(logger);
  console.log(
    `accepted=${kt.articles.length} scraped=${kt.scrapedTotal} ` +
      `rejectedInvalid=${kt.rejectedInvalid} rejectedLowQuality=${kt.rejectedLowQuality}`,
  );
  for (const a of kt.articles.slice(0, 3)) {
    console.log({
      title: a.title,
      contentLen: a.content.length,
      url: a.url,
      img: a.imageUrl?.slice(0, 80) ?? null,
      publishedAt: a.publishedAt,
    });
  }
}

main().catch((err) => {
  console.error('FATAL', err);
  process.exit(1);
});
