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
import { fetchHtml as resilientFetchHtml } from '../common/util/http-fetch.util';

const SOURCE = 'Kigali Today';
const BASE_URL = 'https://www.kigalitoday.com';
const SCRAPE_LIMIT = 20;

// Try multiple listing paths — KigaliToday uses Joomla SEF URLs;
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
  if (['tag', 'tags', 'category', 'author', 'search', 'component', 'rss'].some((s) => segments[0] === s)) return false;
  return true;
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

export async function scrapeKigaliToday(logger: Logger): Promise<RwScrapeResult> {
  const html = await fetchListingHtml(logger);
  if (!html) {
    logger.warn(`${SOURCE}: all listing URL candidates failed`);
    return { articles: [], scrapedTotal: 0, rejectedInvalid: 0, rejectedLowQuality: 0 };
  }

  const $ = cheerio.load(html);
  const articles: NormalizedArticle[] = [];
  const seenUrls = new Set<string>();
  let scrapedTotal = 0;
  let rejectedInvalid = 0;
  let rejectedLowQuality = 0;

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

  for (const el of elements.slice(0, SCRAPE_LIMIT)) {
    try {
      const $el = $(el);

      // Prefer specific headline links, then any article-shaped link
      let linkEl = $el.find('h3.headline a[href], h2 a[href], h3 a[href]').first();
      if (!linkEl.length) {
        linkEl = $el.find('a[href]').filter((_, a) => isArticleUrl($(a).attr('href') ?? '')).first();
      }
      if (!linkEl.length) linkEl = $el.find('a[href]').first();

      const href = linkEl.attr('href') ?? '';
      if (!href) continue;

      const articleUrl = resolveUrl(href);
      if (!isArticleUrl(href) && !/\/article\//.test(href)) continue;
      if (seenUrls.has(articleUrl)) continue;
      seenUrls.add(articleUrl);
      scrapedTotal++;

      const listingFallbackTitle = normalizeText(
        $el.find('h3.headline').first().text() ||
          $el.find('h1, h2, h3, h4').first().text() ||
          linkEl.text(),
      );
      const listingTeaser = normalizeText($el.find('.summary-container p, .article-introtext p, p').first().text());
      const listingImage =
        $el.find('img[src]').first().attr('src') ??
        $el.find('a img').attr('src') ??
        null;

      const detail = await scrapeArticleDetail(
        articleUrl,
        logger,
        listingFallbackTitle,
        listingTeaser,
        listingImage,
      );
      if (!detail) {
        rejectedInvalid++;
        continue;
      }

      const candidate: NormalizedArticle = {
        title: detail.title.substring(0, 500),
        content: sanitizeContentForAI(detail.content),
        imageUrl: detail.imageUrl,
        url: articleUrl,
        source: SOURCE,
        originalLanguage: 'rw',
        publishedAt: detail.publishedAt,
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
      };

      if (!isValidArticle(candidate, { minContentLength: 200 })) {
        logger.warn(
          `${SOURCE}: skipped invalid article (${articleUrl}) contentLen=${candidate.content.length}`,
        );
        rejectedInvalid++;
        continue;
      }

      const quality = getContentQualityScore(candidate.title, candidate.content, {
        minContentLength: 200,
      });
      if (!quality.ok) {
        rejectedLowQuality++;
        continue;
      }

      if (!hasRealJournalisticContent(candidate.content, candidate.title)) {
        rejectedLowQuality++;
        continue;
      }

      articles.push(candidate);
    } catch (err) {
      logger.warn(`${SOURCE}: failed to parse element — ${(err as Error).message}`);
    }
  }

  logger.log(`${SOURCE}: scraped ${articles.length} accepted articles`);
  return { articles, scrapedTotal, rejectedInvalid, rejectedLowQuality };
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
      $('[itemprop="headline"], h1.article-title, h1.page-header, article h1, .entry-title, h1')
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
    content = normalizeText(content.length > 0 ? `${content} ${listingTeaser}` : listingTeaser);
  }

  if (content.length < 100) {
    logger.warn(`${SOURCE}: detail page too short (${content.length} chars) — ${articleUrl}`);
    return null;
  }

  return { title, content, imageUrl, publishedAt };
}
