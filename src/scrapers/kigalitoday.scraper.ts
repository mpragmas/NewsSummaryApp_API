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
const LISTING_URL = 'https://www.kigalitoday.com/amakuru/';
const SCRAPE_LIMIT = 20;

function fetchHtml(url: string, logger: Logger): Promise<string | null> {
  // Kigali Today is behind Cloudflare which TLS-fingerprints Node's fetch and
  // returns a "Just a moment..." challenge page. We fall back to the system
  // `curl` binary (available on Render/Linux) for these requests.
  return resilientFetchHtml(url, SOURCE, logger, {
    timeoutMs: 15_000,
    maxRetries: 2,
    curlFallback: true,
    preferCurl: true,
  });
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

export async function scrapeKigaliToday(
  logger: Logger,
): Promise<RwScrapeResult> {
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

  // Kigali Today renders the news list as `ul.items.hedSumm > li > .item-container`,
  // with `h3.headline > a` linking to the article. Selectors are listed in
  // priority order — first one with 2+ matches wins.
  const selectors = [
    'ul.items.hedSumm > li',
    '.item-container',
    '.hedSumm li',
    '.automated-news .item-container',
    'article',
    'div[class*="news"]',
  ];

  let elements =
    selectors
      .map((sel) => $(sel).toArray())
      .find((found) => found.length >= 2) ?? [];

  // Fallback: parent containers of article-link headings
  if (elements.length === 0) {
    elements = $(
      'h2 a[href*="/article/"], h3 a[href*="/article/"], a[href*="/article/"]',
    )
      .toArray()
      .map((a) => $(a).closest('div, li, section').get(0))
      .filter((el): el is NonNullable<typeof el> => el != null);
  }

  for (const el of elements.slice(0, SCRAPE_LIMIT)) {
    try {
      const $el = $(el);

      // Prefer the headline link inside the card — never a category/navigation link.
      const linkEl =
        $el.find('h3.headline a[href*="/article/"]').first().length > 0
          ? $el.find('h3.headline a[href*="/article/"]').first()
          : $el.find('a[href*="/article/"]').first();
      const href = linkEl.attr('href') ?? '';
      if (!href) continue;
      if (!/\/article\//.test(href)) continue;

      const articleUrl = resolveUrl(href);
      if (!articleUrl) continue;
      if (seenUrls.has(articleUrl)) continue;
      seenUrls.add(articleUrl);
      scrapedTotal++;

      const listingFallbackTitle = normalizeText(
        $el.find('h3.headline').first().text() ||
          $el.find('h1, h2, h3, h4').first().text() ||
          linkEl.text(),
      );
      const listingTeaser = normalizeText(
        $el.find('.summary-container p').text(),
      );
      const listingImage =
        $el.find('img[src]').first().attr('src') ??
        $el.find('a.headline-image img').attr('src') ??
        null;
      const detail = await scrapeKigaliTodayDetail(
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

async function scrapeKigaliTodayDetail(
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
        'h1.wsj-article-headline, [itemprop="headline"], h1.article-title, article h1, .entry-title, h1',
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

  const title = titleCandidates.find((value) => isMeaningfulTitle(value));
  if (!title) return null;

  const publishedAtRaw =
    $('time[datetime]').first().attr('datetime') ??
    $('meta[property="article:published_time"]').attr('content') ??
    $('meta[name="pubdate"]').attr('content') ??
    $('meta[itemprop="datePublished"]').attr('content') ??
    $('time').first().text();
  const publishedAt = parsePublishedAt(publishedAtRaw);

  let imageUrl = extractBestImageFromCheerioRoot($, articleUrl, title);
  if (!imageUrl && listingImageHref) {
    imageUrl = resolveUrl(listingImageHref) || null;
  }

  // Kigali Today wraps the body in `[itemprop="articleBody"]` (a.k.a.
  // `#wsj-article-wrap.article-wrap`). Target it directly so we don't pick
  // up sidebar/comment paragraphs.
  const contentSelectors = [
    '[itemprop="articleBody"] p',
    '#wsj-article-wrap p',
    'article#article-contents [itemprop="articleBody"] p',
    'article#article-contents p',
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

  // Listing cards often include a usable teaser; merge when the detail page is thin.
  if (content.length < 250 && listingTeaser.length > 80) {
    content = normalizeText(
      content.length > 0 ? `${content} ${listingTeaser}` : listingTeaser,
    );
  }

  if (content.length < 100) {
    logger.warn(
      `${SOURCE}: detail page too short (${content.length} chars) — ${articleUrl}`,
    );
    return null;
  }

  return { title, content, imageUrl, publishedAt };
}
