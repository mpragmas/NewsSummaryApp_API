import { Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import type { NormalizedArticle } from '../rss/rss.service';
import type { SupportedLanguage } from '../rss/rss-feeds.config';
import {
  getContentQualityScore,
  hasRealJournalisticContent,
  isMeaningfulTitle,
  isValidArticle,
  normalizeText,
  parsePublishedAt,
  sanitizeContentForAI,
} from '../common/util/article-validation';
import {
  extractBestImageFromArticleHtml,
  extractBestImageFromCheerioRoot,
} from '../common/util/image-extractor.util';
import { fetchHtml as resilientFetchHtml } from '../common/util/http-fetch.util';
import {
  type ScrapeDropReport,
  emptyDropReport,
  formatDropReport,
  mergeDropReports,
} from './scrape-report';

const SOURCE = 'Igihe';
const BASE_URL = 'https://igihe.com';
const IGIHE_HOST_RE = /(^|\.)igihe\.com$/i;
/** Detail pages fetched in parallel per section (keeps each run well under the cron window). */
const DETAIL_CONCURRENCY = 4;

// Each section maps to a language edition / topic listing. Broader coverage than
// before: the RW homepage alone publishes ~20+ items, and topic sections surface
// articles that never reach the homepage rail. Cross-section URL duplicates are
// removed downstream by the deduplication stage.
const RW_SECTIONS: Array<{
  listingUrl: string;
  lang: SupportedLanguage;
  limit: number;
}> = [
  { listingUrl: 'https://igihe.com/amakuru/', lang: 'rw', limit: 25 },
  { listingUrl: 'https://igihe.com/amakuru/u-rwanda/', lang: 'rw', limit: 15 },
  { listingUrl: 'https://igihe.com/amakuru/politiki/', lang: 'rw', limit: 12 },
  { listingUrl: 'https://igihe.com/amakuru/ubukungu/', lang: 'rw', limit: 12 },
  { listingUrl: 'https://igihe.com/imikino/', lang: 'rw', limit: 12 },
  {
    listingUrl: 'https://igihe.com/amakuru/mu-mahanga/',
    lang: 'rw',
    limit: 12,
  },
];

const WP_API_SECTIONS: Array<{
  apiUrl: string;
  lang: SupportedLanguage;
  limit: number;
}> = [
  {
    apiUrl:
      'https://new.igihe.com/english/wp-json/wp/v2/posts?per_page=20&_embed=1',
    lang: 'en',
    limit: 20,
  },
  {
    apiUrl:
      'https://new.igihe.com/french/wp-json/wp/v2/posts?per_page=20&_embed=1',
    lang: 'fr',
    limit: 20,
  },
];

export interface RwScrapeResult {
  articles: NormalizedArticle[];
  scrapedTotal: number;
  rejectedInvalid: number;
  rejectedLowQuality: number;
  /** Where every discovered candidate ended up (discovered → inserted/dropped). */
  report: ScrapeDropReport;
}

function fetchHtml(url: string, logger: Logger): Promise<string | null> {
  return resilientFetchHtml(url, SOURCE, logger, {
    timeoutMs: 15_000,
    maxRetries: 2,
    curlFallback: true,
  });
}

async function fetchJson<T>(url: string, logger: Logger): Promise<T | null> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'NewsAggregator/1.0 (+https://newssummary.app)',
        Accept: 'application/json,text/plain;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) {
      logger.warn(`${SOURCE}: JSON fetch ${res.status} for ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    logger.warn(
      `${SOURCE}: JSON fetch failed for ${url} — ${(err as Error).message}`,
    );
    return null;
  } finally {
    clearTimeout(tid);
  }
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

/** Accept both igihe.com and www.igihe.com (the site canonicalizes to www). */
function isIgiheUrl(url: string): boolean {
  try {
    return IGIHE_HOST_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Drop non-editorial links that share the `/article/` shape: the advertising
 * service (`/serivisi/kwamamaza/`) and sponsor banners. These otherwise burn a
 * detail fetch and show up as fetch failures in the drop report.
 */
function isEditorialUrl(url: string): boolean {
  const path = url.toLowerCase();
  if (/\/serivisi\//.test(path)) return false;
  if (/kwamamaza/.test(path)) return false;
  if (/[-/]banner(-|\/|$|\d)/.test(path)) return false;
  return true;
}

/**
 * Detect article language from its URL path.
 * Falls back to the section language when the URL doesn't carry a clear signal.
 */
function detectLang(
  url: string,
  sectionLang: SupportedLanguage,
): SupportedLanguage {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  if (/^\/en(\/|$)/.test(path)) return 'en';
  if (/^\/fr(\/|$)/.test(path)) return 'fr';
  return sectionLang;
}

/**
 * Returns true when `href` looks like a real article link rather than a nav /
 * category link. Accepts the `/article/` pattern and also any multi-segment
 * path under the section prefix (e.g. `/en/sport/12345-title.html`).
 */
function isArticleHref(href: string, lang: SupportedLanguage): boolean {
  if (/\/article\//.test(href)) return true;
  // EN / FR section: any link with at least 3 path segments under the prefix
  if (lang === 'en' && /\/en\/[^/]+\/[^/]/.test(href)) return true;
  if (lang === 'fr' && /\/fr\/[^/]+\/[^/]/.test(href)) return true;
  return false;
}

/** Run an async mapper over items with a bounded concurrency pool. */
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

export async function scrapeIgihe(logger: Logger): Promise<RwScrapeResult> {
  // Scrape all language/topic sections concurrently.
  const sectionResults = await Promise.all([
    ...RW_SECTIONS.map((sec) =>
      scrapeSection(sec.listingUrl, sec.lang, sec.limit, logger),
    ),
    ...WP_API_SECTIONS.map((sec) =>
      scrapeWordPressApiSection(sec.apiUrl, sec.lang, sec.limit, logger),
    ),
  ]);

  const articles = sectionResults.flatMap((r) => r.articles);
  const report = mergeDropReports(sectionResults.map((r) => r.report));

  logger.log(`${SOURCE}: ${formatDropReport(SOURCE, report)}`);

  return {
    articles,
    scrapedTotal: report.discovered,
    rejectedInvalid: report.fetchFailed + report.rejectedInvalid,
    rejectedLowQuality: report.rejectedLowQuality,
    report,
  };
}

interface IgiheWpPost {
  id?: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
  excerpt?: { rendered?: string };
  featured_image?: { url?: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: Record<string, { source_url?: string; url?: string }>;
      };
    }>;
  };
}

function htmlToText(html: string): string {
  return normalizeText(cheerio.load(html).root().text());
}

function bestWpFeaturedImage(post: IgiheWpPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const sizes = media?.media_details?.sizes;
  const candidates = [
    post.featured_image?.url,
    sizes?.full?.source_url,
    sizes?.full?.url,
    sizes?.large?.source_url,
    sizes?.large?.url,
    sizes?.medium_large?.source_url,
    sizes?.medium_large?.url,
    media?.source_url,
  ];
  return candidates.find((url) => url && !isWpPlaceholderImage(url)) ?? null;
}

function isWpPlaceholderImage(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      /(^|\.)igihe\.com$/i.test(u.hostname) &&
      /\/IMG\/logo\/cp-\d+\.jpe?g$/i.test(u.pathname)
    );
  } catch {
    return true;
  }
}

async function scrapeWordPressApiSection(
  apiUrl: string,
  lang: SupportedLanguage,
  limit: number,
  logger: Logger,
): Promise<{ articles: NormalizedArticle[]; report: ScrapeDropReport }> {
  const report = emptyDropReport();
  const posts = await fetchJson<IgiheWpPost[]>(apiUrl, logger);
  if (!Array.isArray(posts)) {
    report.listingFailed = 1;
    return { articles: [], report };
  }

  const articles: NormalizedArticle[] = [];
  for (const post of posts.slice(0, limit)) {
    const url = post.link?.trim();
    if (!url || !isIgiheUrl(url)) {
      report.skippedNonArticle++;
      continue;
    }
    report.discovered++;

    const title = htmlToText(post.title?.rendered ?? '');
    const contentHtml = post.content?.rendered ?? '';
    let content = htmlToText(contentHtml);
    const excerpt = htmlToText(post.excerpt?.rendered ?? '');
    if (content.length < 250 && excerpt.length > content.length)
      content = excerpt;

    const imageUrl =
      bestWpFeaturedImage(post) ??
      extractBestImageFromArticleHtml(contentHtml, url, title);

    const candidate: NormalizedArticle = {
      title: title.substring(0, 500),
      content: sanitizeContentForAI(content),
      imageUrl,
      url,
      source: SOURCE,
      originalLanguage: lang,
      publishedAt: parsePublishedAt(post.date),
      continent: 'Africa',
      region: 'East Africa',
      country: 'Rwanda',
      via: 'scrape',
    };

    if (!isValidArticle(candidate, { minContentLength: 200 })) {
      report.rejectedInvalid++;
      continue;
    }
    const quality = getContentQualityScore(candidate.title, candidate.content, {
      minContentLength: 200,
    });
    if (
      !quality.ok ||
      !hasRealJournalisticContent(candidate.content, candidate.title)
    ) {
      report.rejectedLowQuality++;
      continue;
    }

    report.inserted++;
    articles.push(candidate);
  }

  logger.debug(
    `${SOURCE} [${lang}] WordPress API: ${formatDropReport(`${lang}`, report)}`,
  );
  return { articles, report };
}

async function scrapeSection(
  listingUrl: string,
  lang: SupportedLanguage,
  limit: number,
  logger: Logger,
): Promise<{ articles: NormalizedArticle[]; report: ScrapeDropReport }> {
  const report = emptyDropReport();
  const html = await fetchHtml(listingUrl, logger);
  if (!html) {
    report.listingFailed = 1;
    logger.warn(
      `${SOURCE} [${lang}] ${listingUrl}: listing fetch FAILED (blocked/offline) — 0 articles from this section`,
    );
    return { articles: [], report };
  }

  const $ = cheerio.load(html);
  const seenUrls = new Set<string>();

  const selectors = [
    '.homenews',
    '.article-wrap .homenews-title',
    '.article-wrap',
    'article',
    '.news-item',
    '.post',
    'div[class*="news"]',
  ];

  let elements =
    selectors
      .map((sel) => $(sel).toArray())
      .find((found) => found.length >= 2) ?? [];

  // Broader fallback: any heading link that looks like an article
  if (elements.length === 0) {
    elements = $(
      'h2 a[href], h3 a[href], h4 a[href], .headline a[href], a[href*="/article/"]',
    )
      .toArray()
      .map((a) => $(a).closest('div, li, section, article').get(0))
      .filter((el): el is NonNullable<typeof el> => el != null);
  }

  // ── Phase 1: collect unique candidate URLs from the listing ──────────────
  interface Candidate {
    url: string;
    listingTitle: string;
  }
  const candidates: Candidate[] = [];

  for (const el of elements) {
    if (candidates.length >= limit) break;
    const $el = $(el);

    let linkEl = $el.find(`a[href*="/article/"]`).first();
    if (!linkEl.length) {
      linkEl = $el
        .find('a[href]')
        .filter((_, a) => {
          const h = $(a).attr('href') ?? '';
          return isArticleHref(h, lang) && !h.includes('#');
        })
        .first();
    }
    if (!linkEl.length) {
      linkEl = $el.find('a[href]').first();
    }

    const href = linkEl.attr('href') ?? '';
    if (!href) continue;

    const articleUrl = resolveUrl(href);
    if (!isIgiheUrl(articleUrl) || !isEditorialUrl(articleUrl)) {
      report.skippedNonArticle++;
      continue;
    }
    if (!isArticleHref(href, lang) && !/\/article\//.test(href)) {
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
        $el.find('h1, h2, h3, h4').first().text() || linkEl.text(),
      ),
    });
  }

  // ── Phase 2: fetch + validate detail pages (bounded concurrency) ─────────
  const built = await mapPool(candidates, DETAIL_CONCURRENCY, async (cand) => {
    try {
      const detail = await scrapeArticleDetail(
        cand.url,
        logger,
        cand.listingTitle,
      );
      if (!detail) {
        report.fetchFailed++;
        return null;
      }

      const articleLang = detectLang(cand.url, lang);
      const candidate: NormalizedArticle = {
        title: detail.title.substring(0, 500),
        content: sanitizeContentForAI(detail.content),
        imageUrl: detail.imageUrl,
        url: cand.url,
        source: SOURCE,
        originalLanguage: articleLang,
        publishedAt: detail.publishedAt,
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
        via: 'scrape',
      };

      if (!isValidArticle(candidate, { minContentLength: 250 })) {
        report.rejectedInvalid++;
        logger.debug(
          `${SOURCE} [${articleLang}]: rejected invalid (len=${candidate.content.length}) ${cand.url}`,
        );
        return null;
      }

      const quality = getContentQualityScore(
        candidate.title,
        candidate.content,
        {
          minContentLength: 250,
        },
      );
      if (!quality.ok) {
        report.rejectedLowQuality++;
        logger.debug(
          `${SOURCE} [${articleLang}]: rejected lowQuality (${quality.code}) ${cand.url}`,
        );
        return null;
      }

      if (candidate.content.length < 300) {
        report.rejectedLowQuality++;
        return null;
      }

      if (!hasRealJournalisticContent(candidate.content, candidate.title)) {
        report.rejectedLowQuality++;
        logger.debug(
          `${SOURCE} [${articleLang}]: rejected notJournalistic ${cand.url}`,
        );
        return null;
      }

      report.inserted++;
      return candidate;
    } catch (err) {
      report.fetchFailed++;
      logger.warn(
        `${SOURCE} [${lang}]: failed to parse ${cand.url} — ${(err as Error).message}`,
      );
      return null;
    }
  });

  const articles = built.filter((a): a is NormalizedArticle => a !== null);

  logger.debug(
    `${SOURCE} [${lang}] ${listingUrl}: ${formatDropReport(`${lang}`, report)}`,
  );

  return { articles, report };
}

async function scrapeArticleDetail(
  articleUrl: string,
  logger: Logger,
  listingFallbackTitle: string,
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
      $('h1.headline, h1.article-title, article h1, .article-title h1, h1')
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
  if (!title) {
    logger.debug(
      `${SOURCE}: rejected detail page with no valid title (${articleUrl})`,
    );
    return null;
  }

  const imageUrl = extractBestImageFromCheerioRoot($, articleUrl, title);

  const publishedAtRaw =
    $('time[datetime]').first().attr('datetime') ??
    $('meta[property="article:published_time"]').attr('content') ??
    $('meta[name="pubdate"]').attr('content') ??
    $('meta[itemprop="datePublished"]').attr('content') ??
    $('time').first().text();
  const publishedAt = parsePublishedAt(publishedAtRaw);

  const contentSelectors = [
    '.fulltext p',
    '.surtitre p, .fulltext p',
    '.text-article p',
    'article p',
    'p',
  ];

  const paragraphBucket = contentSelectors
    .map((selector) =>
      $(selector)
        .toArray()
        .map((p) => normalizeText($(p).text()))
        .filter((text) => text.length > 25),
    )
    .find((candidate) => candidate.length > 2);

  let content = normalizeText((paragraphBucket ?? []).join(' '));

  if (content.length < 300) {
    const refetched = await fetchHtml(articleUrl, logger);
    if (refetched) {
      const $$ = cheerio.load(refetched);
      const fallback = extractFallbackBody($$);
      if (fallback.length > content.length) content = fallback;
    }
  }

  return { title, content, imageUrl, publishedAt };
}

function extractFallbackBody($: cheerio.CheerioAPI): string {
  const candidates = [
    '.fulltext',
    '.text-article',
    '.surtitre',
    'article',
    '#content',
    'main',
  ].map((sel) => normalizeText($(sel).first().text()));

  return candidates.sort((a, b) => b.length - a.length)[0] ?? '';
}
