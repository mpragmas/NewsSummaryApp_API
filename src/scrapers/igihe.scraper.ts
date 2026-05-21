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
import { extractBestImageFromCheerioRoot } from '../common/util/image-extractor.util';
import { fetchHtml as resilientFetchHtml } from '../common/util/http-fetch.util';

const SOURCE = 'Igihe';
const BASE_URL = 'https://igihe.com';
const LISTING_URL = 'https://igihe.com/amakuru/';
const SCRAPE_LIMIT = 20;

export interface RwScrapeResult {
  articles: NormalizedArticle[];
  scrapedTotal: number;
  rejectedInvalid: number;
  rejectedLowQuality: number;
}

function fetchHtml(url: string, logger: Logger): Promise<string | null> {
  return resilientFetchHtml(url, SOURCE, logger, {
    timeoutMs: 15_000,
    maxRetries: 2,
    // Igihe doesn't use Cloudflare today, but keep the curl fallback armed in
    // case they enable it — it's a no-op when fetch succeeds.
    curlFallback: true,
  });
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

export async function scrapeIgihe(logger: Logger): Promise<RwScrapeResult> {
  const html = await fetchHtml(LISTING_URL, logger);
  if (!html) {
    return {
      articles: [],
      scrapedTotal: 0,
      rejectedInvalid: 0,
      rejectedLowQuality: 0,
    };
  }

  const $ = cheerio.load(html);
  const articles: NormalizedArticle[] = [];
  const seenUrls = new Set<string>();
  let scrapedTotal = 0;
  let rejectedInvalid = 0;
  let rejectedLowQuality = 0;

  // Igihe wraps each news card in `.article-wrap > .homenews`. We prefer the
  // narrower `.homenews` container because `.article-wrap` is also used inside
  // article detail pages (gallery wrappers).
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

  // Fallback: grab parent containers of article-style heading links
  if (elements.length === 0) {
    elements = $('h2 a[href*="/article/"], h3 a[href*="/article/"], a[href*="/article/"]')
      .toArray()
      .map((a) => $(a).closest('div, li, section').get(0))
      .filter((el): el is NonNullable<typeof el> => el != null);
  }

  for (const el of elements.slice(0, SCRAPE_LIMIT)) {
    try {
      const $el = $(el);

      // Prefer the first link that points to an actual article page; this avoids
      // picking up navigation or category links on the listing.
      const linkEl =
        $el.find('a[href*="/article/"]').first().length > 0
          ? $el.find('a[href*="/article/"]').first()
          : $el.find('a[href]').first();
      const href = linkEl.attr('href') ?? '';
      if (!href) continue;
      if (!/\/article\//.test(href)) continue;

      const articleUrl = resolveUrl(href);
      if (!articleUrl) continue;
      if (seenUrls.has(articleUrl)) continue;
      seenUrls.add(articleUrl);
      scrapedTotal++;

      const listingFallbackTitle = normalizeText(
        $el.find('h1, h2, h3, h4').first().text() || linkEl.text(),
      );
      const detail = await scrapeIgiheArticleDetail(
        articleUrl,
        logger,
        listingFallbackTitle,
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

      // Hard safety gate: invalid RW scraped article must never be saved.
      if (!isValidArticle(candidate, { minContentLength: 250 })) {
        logger.warn(
          `${SOURCE}: skipped invalid article (${articleUrl}) title="${candidate.title}" contentLen=${candidate.content.length}`,
        );
        rejectedInvalid++;
        continue;
      }

      const quality = getContentQualityScore(
        candidate.title,
        candidate.content,
        {
          minContentLength: 250,
        },
      );
      if (!quality.ok) {
        rejectedLowQuality++;
        continue;
      }

      // Hard Igihe body rule after fallback extraction.
      if (candidate.content.length < 300) {
        rejectedLowQuality++;
        continue;
      }

      if (!hasRealJournalisticContent(candidate.content, candidate.title)) {
        rejectedLowQuality++;
        continue;
      }

      articles.push(candidate);
    } catch (err) {
      logger.warn(
        `${SOURCE}: failed to parse element — ${(err as Error).message}`,
      );
    }
  }

  logger.log(`${SOURCE}: scraped ${articles.length} accepted articles`);
  return { articles, scrapedTotal, rejectedInvalid, rejectedLowQuality };
}

async function scrapeIgiheArticleDetail(
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

  // Required extraction order:
  // 1) h1 headline
  // 2) title meta tag
  // 3) fallback only if valid (>5 chars, not date-like)
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
  const title = titleCandidates.find((value) => isMeaningfulTitle(value));
  if (!title) {
    logger.warn(
      `${SOURCE}: rejected detail page with invalid title (${articleUrl})`,
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

  // Igihe stores the lead in `.surtitre` and the main body in `.fulltext`.
  // Fall back to the outer wrapper `.text-article` then to broad `p`.
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

  // Igihe content fallback strategy: if body is too short, try broader DOM extraction.
  if (content.length < 300) {
    const refetched = await fetchHtml(articleUrl, logger);
    if (refetched) {
      const $$ = cheerio.load(refetched);
      const fallbackBody = extractFallbackBody($$);
      if (fallbackBody.length > content.length) {
        content = fallbackBody;
      }
    }
  }

  return {
    title,
    content,
    imageUrl,
    publishedAt,
  };
}

function extractFallbackBody($: cheerio.CheerioAPI): string {
  const fallbackSelectors = [
    '.fulltext',
    '.text-article',
    '.surtitre',
    'article',
    '#content',
    'main',
  ];

  const best = fallbackSelectors
    .map((selector) => normalizeText($(selector).first().text()))
    .sort((a, b) => b.length - a.length)[0];

  return normalizeText(best);
}
