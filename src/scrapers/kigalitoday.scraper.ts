import { Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import type { NormalizedArticle } from '../rss/rss.service';
import {
  getContentQualityScore,
  hasRealJournalisticContent,
  isMeaningfulTitle,
  isValidArticle,
  normalizeText,
  parsePublishedAt,
  sanitizeContentForAI,
} from '../common/util/article-validation';
import type { RwScrapeResult } from './igihe.scraper';
import { extractBestImageFromCheerioRoot } from '../common/util/image-extractor.util';
import {
  fetchHtml as resilientFetchHtml,
  probeFetch,
} from '../common/util/http-fetch.util';
import { emptyDropReport, formatDropReport } from './scrape-report';

const SOURCE = 'Kigali Today';
const BASE_URL = 'https://www.kigalitoday.com';
const SCRAPE_LIMIT = 24;
const DETAIL_CONCURRENCY = 4;

// Try multiple listing paths — KigaliToday uses Joomla/SPIP SEF URLs;
// which one responds depends on their server config.
const LISTING_CANDIDATES = [
  'https://www.kigalitoday.com/',
  'https://www.kigalitoday.com/amakuru/',
  'https://www.kigalitoday.com/amakuru',
  'https://www.kigalitoday.com/index.php/amakuru',
];

// Extra headers to help curl look like a real browser and avoid Cloudflare blocks.
const BROWSER_HEADERS: Record<string, string> = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'rw,fr;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
};

function fetchHtml(url: string, logger: Logger): Promise<string | null> {
  return resilientFetchHtml(url, SOURCE, logger, {
    timeoutMs: 20_000,
    maxRetries: 2,
    curlFallback: true,
    preferCurl: true,
    // KigaliToday is behind a full Cloudflare JS challenge that fetch/curl
    // cannot solve. Route through the scraping API when SCRAPER_API_KEY is set;
    // no-op (direct fetch) otherwise.
    useScraperApi: true,
    extraHeaders: BROWSER_HEADERS,
  });
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

function isArticleUrl(href: string): boolean {
  if (!href) return false;
  const resolved = resolveUrl(href);
  if (!resolved.startsWith(BASE_URL)) return false;
  const path = resolved.replace(BASE_URL, '');
  // Reject root, single-segment paths, and obvious non-article paths
  const segments = path.split('/').filter(Boolean);
  if (segments.length < 2) return false;
  if (
    ['tag', 'tags', 'category', 'author', 'search', 'component', 'rss'].some(
      (s) => segments[0] === s,
    )
  )
    return false;
  return true;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (cursor < items.length) {
        const idx = cursor++;
        results[idx] = await fn(items[idx]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

/** Try each listing URL candidate and return the first that yields usable HTML. */
async function fetchListingHtml(logger: Logger): Promise<string | null> {
  for (const url of LISTING_CANDIDATES) {
    const html = await fetchHtml(url, logger);
    if (!html) continue;

    // Check the page actually has article-like links before accepting it
    const $ = cheerio.load(html);
    const hasLinks =
      $('a[href*="/article/"]').length > 0 ||
      $('ul.items li a[href]').length > 2 ||
      $('h3.headline a[href]').length > 0 ||
      $('h2 a[href]').length > 2;
    if (hasLinks) {
      logger.debug(`${SOURCE}: listing page found at ${url}`);
      return html;
    }
  }
  return null;
}

export async function scrapeKigaliToday(
  logger: Logger,
): Promise<RwScrapeResult> {
  const report = emptyDropReport();
  const html = await fetchListingHtml(logger);
  if (!html) {
    report.listingFailed = 1;
    // Explain *why* — Cloudflare's JS challenge cannot be solved by fetch/curl
    // and is the long-standing reason this source goes stale. Surfacing it makes
    // the failure actionable (needs a headless browser or scraping API).
    const diag = await probeFetch(LISTING_CANDIDATES[0], {
      timeoutMs: 20_000,
      extraHeaders: BROWSER_HEADERS,
    });
    if (diag.reason === 'cloudflare') {
      logger.error(
        `${SOURCE}: BLOCKED by Cloudflare bot-challenge (status=${diag.status}). ` +
          `Server-side fetch/curl cannot bypass this — needs a headless browser ` +
          `or scraping API. 0 articles ingested this run.`,
      );
    } else {
      logger.warn(
        `${SOURCE}: all listing URL candidates failed (reason=${diag.reason ?? 'unknown'}, status=${diag.status})`,
      );
    }
    logger.log(`${SOURCE}: ${formatDropReport(SOURCE, report)}`);
    return {
      articles: [],
      scrapedTotal: 0,
      rejectedInvalid: 0,
      rejectedLowQuality: 0,
      report,
    };
  }

  const $ = cheerio.load(html);
  const seenUrls = new Set<string>();

  // Joomla listing selectors in priority order — first match with 2+ items wins.
  const selectors = [
    'ul.items.hedSumm > li',
    'ul.items > li',
    '.item-container',
    '.hedSumm li',
    'article',
    'div[class*="news"]',
    'div[class*="item"]',
  ];

  let elements =
    selectors
      .map((sel) => $(sel).toArray())
      .find((found) => found.length >= 2) ?? [];

  // Broad fallback: parent containers of any article-looking links
  if (elements.length === 0) {
    elements = $('a[href]')
      .filter((_, a) => isArticleUrl($(a).attr('href') ?? ''))
      .toArray()
      .map((a) => $(a).closest('div, li, article, section').get(0))
      .filter((el): el is NonNullable<typeof el> => el != null);
  }

  interface Candidate {
    url: string;
    listingTitle: string;
    listingTeaser: string;
    listingImage: string | null;
  }
  const candidates: Candidate[] = [];

  for (const el of elements) {
    if (candidates.length >= SCRAPE_LIMIT) break;
    const $el = $(el);

    let linkEl = $el
      .find('h3.headline a[href], h2 a[href], h3 a[href]')
      .first();
    if (!linkEl.length) {
      linkEl = $el
        .find('a[href]')
        .filter((_, a) => isArticleUrl($(a).attr('href') ?? ''))
        .first();
    }
    if (!linkEl.length) linkEl = $el.find('a[href]').first();

    const href = linkEl.attr('href') ?? '';
    if (!href) continue;

    const articleUrl = resolveUrl(href);
    if (!isArticleUrl(href) && !/\/article\//.test(href)) {
      report.skippedNonArticle++;
      continue;
    }
    if (seenUrls.has(articleUrl)) {
      report.skippedDuplicate++;
      continue;
    }
    seenUrls.add(articleUrl);
    report.discovered++;

    candidates.push({
      url: articleUrl,
      listingTitle: normalizeText(
        $el.find('h3.headline').first().text() ||
          $el.find('h1, h2, h3, h4').first().text() ||
          linkEl.text(),
      ),
      listingTeaser: normalizeText(
        $el
          .find('.summary-container p, .article-introtext p, p')
          .first()
          .text(),
      ),
      listingImage:
        $el.find('img[src]').first().attr('src') ??
        $el.find('a img').attr('src') ??
        null,
    });
  }

  const built = await mapPool(candidates, DETAIL_CONCURRENCY, async (cand) => {
    try {
      const detail = await scrapeArticleDetail(
        cand.url,
        logger,
        cand.listingTitle,
        cand.listingTeaser,
        cand.listingImage,
      );
      if (!detail) {
        report.fetchFailed++;
        return null;
      }

      const candidate: NormalizedArticle = {
        title: detail.title.substring(0, 500),
        content: sanitizeContentForAI(detail.content),
        imageUrl: detail.imageUrl,
        url: cand.url,
        source: SOURCE,
        originalLanguage: 'rw',
        publishedAt: detail.publishedAt,
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
        via: 'scrape',
      };

      if (!isValidArticle(candidate, { minContentLength: 200 })) {
        report.rejectedInvalid++;
        return null;
      }

      const quality = getContentQualityScore(
        candidate.title,
        candidate.content,
        {
          minContentLength: 200,
        },
      );
      if (!quality.ok) {
        report.rejectedLowQuality++;
        return null;
      }

      if (!hasRealJournalisticContent(candidate.content, candidate.title)) {
        report.rejectedLowQuality++;
        return null;
      }

      report.inserted++;
      return candidate;
    } catch (err) {
      report.fetchFailed++;
      logger.warn(
        `${SOURCE}: failed to parse ${cand.url} — ${(err as Error).message}`,
      );
      return null;
    }
  });

  const articles = built.filter((a): a is NormalizedArticle => a !== null);

  logger.log(`${SOURCE}: ${formatDropReport(SOURCE, report)}`);
  return {
    articles,
    scrapedTotal: report.discovered,
    rejectedInvalid: report.fetchFailed + report.rejectedInvalid,
    rejectedLowQuality: report.rejectedLowQuality,
    report,
  };
}

async function scrapeArticleDetail(
  articleUrl: string,
  logger: Logger,
  listingFallbackTitle: string,
  listingTeaser = '',
  listingImageHref: string | null = null,
): Promise<{
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
} | null> {
  const html = await fetchHtml(articleUrl, logger);
  if (!html) return null;

  const $ = cheerio.load(html);

  const titleCandidates = [
    normalizeText(
      $(
        '[itemprop="headline"], h1.article-title, h1.page-header, article h1, .entry-title, h1',
      )
        .first()
        .text(),
    ),
    normalizeText(
      $('meta[property="og:title"]').attr('content') ??
        $('meta[name="title"]').attr('content') ??
        $('meta[name="twitter:title"]').attr('content') ??
        '',
    ),
    normalizeText(listingFallbackTitle),
  ];

  const title = titleCandidates.find((v) => isMeaningfulTitle(v));
  if (!title) return null;

  const publishedAtRaw =
    $('time[datetime]').first().attr('datetime') ??
    $('meta[property="article:published_time"]').attr('content') ??
    $('meta[name="pubdate"]').attr('content') ??
    $('meta[itemprop="datePublished"]').attr('content') ??
    $('[class*="date"]').first().text() ??
    $('time').first().text();
  const publishedAt = parsePublishedAt(publishedAtRaw);

  let imageUrl = extractBestImageFromCheerioRoot($, articleUrl, title);
  if (!imageUrl && listingImageHref) {
    imageUrl = resolveUrl(listingImageHref) || null;
  }

  // Joomla article body selectors in priority order
  const contentSelectors = [
    '[itemprop="articleBody"] p',
    '.article-fulltext p',
    '.item-page p',
    '#wsj-article-wrap p',
    'article [itemprop="articleBody"] p',
    'article p',
    '.article-introtext p',
    'p',
  ];
  const paragraphBucket = contentSelectors
    .map((selector) =>
      $(selector)
        .toArray()
        .map((p) => normalizeText($(p).text()))
        .filter((text) => text.length > 25),
    )
    .find((bucket) => bucket.length > 1);

  let content = normalizeText((paragraphBucket ?? []).join(' '));

  // Merge listing teaser when the article body is too thin
  if (content.length < 250 && listingTeaser.length > 60) {
    content = normalizeText(
      content.length > 0 ? `${content} ${listingTeaser}` : listingTeaser,
    );
  }

  if (content.length < 100) {
    logger.debug(
      `${SOURCE}: detail page too short (${content.length} chars) — ${articleUrl}`,
    );
    return null;
  }

  return { title, content, imageUrl, publishedAt };
}
