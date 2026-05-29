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
import { extractBestImageFromCheerioRoot } from '../common/util/image-extractor.util';
import { fetchHtml as resilientFetchHtml } from '../common/util/http-fetch.util';

const SOURCE = 'Igihe';
const BASE_URL = 'https://igihe.com';

// Each section maps to one of Igihe's three language editions.
const LANGUAGE_SECTIONS: Array<{
  listingUrl: string;
  lang: SupportedLanguage;
  limit: number;
}> = [
  { listingUrl: 'https://igihe.com/amakuru/', lang: 'rw', limit: 15 },
  { listingUrl: 'https://igihe.com/en/', lang: 'en', limit: 12 },
  { listingUrl: 'https://igihe.com/fr/', lang: 'fr', limit: 12 },
];

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
    curlFallback: true,
  });
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
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

export async function scrapeIgihe(logger: Logger): Promise<RwScrapeResult> {
  // Scrape all language sections concurrently.
  const sectionResults = await Promise.all(
    LANGUAGE_SECTIONS.map((sec) =>
      scrapeSection(sec.listingUrl, sec.lang, sec.limit, logger),
    ),
  );

  const articles = sectionResults.flatMap((r) => r.articles);
  const scrapedTotal = sectionResults.reduce(
    (acc, r) => acc + r.scrapedTotal,
    0,
  );
  const rejectedInvalid = sectionResults.reduce(
    (acc, r) => acc + r.rejectedInvalid,
    0,
  );
  const rejectedLowQuality = sectionResults.reduce(
    (acc, r) => acc + r.rejectedLowQuality,
    0,
  );

  const [rw, en, fr] = sectionResults.map((r) => r.articles.length);
  logger.log(
    `${SOURCE}: accepted rw=${rw} en=${en} fr=${fr} total=${articles.length}`,
  );

  return { articles, scrapedTotal, rejectedInvalid, rejectedLowQuality };
}

async function scrapeSection(
  listingUrl: string,
  lang: SupportedLanguage,
  limit: number,
  logger: Logger,
): Promise<RwScrapeResult> {
  const html = await fetchHtml(listingUrl, logger);
  if (!html) {
    logger.warn(`${SOURCE} [${lang}]: could not fetch listing page ${listingUrl}`);
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

  for (const el of elements.slice(0, limit)) {
    try {
      const $el = $(el);

      // Prefer a link that matches the article URL pattern, then any link.
      let linkEl = $el.find(`a[href*="/article/"]`).first();
      if (!linkEl.length) {
        // For EN/FR sections the path may not include /article/
        linkEl = $el.find('a[href]').filter((_, a) => {
          const h = $(a).attr('href') ?? '';
          return isArticleHref(h, lang) && !h.includes('#');
        }).first();
      }
      if (!linkEl.length) {
        linkEl = $el.find('a[href]').first();
      }

      const href = linkEl.attr('href') ?? '';
      if (!href) continue;

      const articleUrl = resolveUrl(href);
      if (!articleUrl.startsWith(BASE_URL)) continue;
      if (!isArticleHref(href, lang) && !/\/article\//.test(href)) continue;
      if (seenUrls.has(articleUrl)) continue;
      seenUrls.add(articleUrl);
      scrapedTotal++;

      const listingFallbackTitle = normalizeText(
        $el.find('h1, h2, h3, h4').first().text() || linkEl.text(),
      );

      const detail = await scrapeArticleDetail(
        articleUrl,
        logger,
        listingFallbackTitle,
      );
      if (!detail) {
        rejectedInvalid++;
        continue;
      }

      const articleLang = detectLang(articleUrl, lang);

      const candidate: NormalizedArticle = {
        title: detail.title.substring(0, 500),
        content: sanitizeContentForAI(detail.content),
        imageUrl: detail.imageUrl,
        url: articleUrl,
        source: SOURCE,
        originalLanguage: articleLang,
        publishedAt: detail.publishedAt,
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
      };

      if (!isValidArticle(candidate, { minContentLength: 250 })) {
        logger.warn(
          `${SOURCE} [${articleLang}]: skipped invalid article (${articleUrl}) contentLen=${candidate.content.length}`,
        );
        rejectedInvalid++;
        continue;
      }

      const quality = getContentQualityScore(candidate.title, candidate.content, {
        minContentLength: 250,
      });
      if (!quality.ok) {
        rejectedLowQuality++;
        continue;
      }

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
      logger.warn(`${SOURCE} [${lang}]: failed to parse element — ${(err as Error).message}`);
    }
  }

  return { articles, scrapedTotal, rejectedInvalid, rejectedLowQuality };
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
    logger.warn(`${SOURCE}: rejected detail page with no valid title (${articleUrl})`);
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
