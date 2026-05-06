import { Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import type { NormalizedArticle } from '../rss/rss.service';

const SOURCE = 'Kigali Today';
const BASE_URL = 'https://www.kigalitoday.com';
const LISTING_URL = 'https://www.kigalitoday.com/amakuru/';
const SCRAPE_LIMIT = 20;
const FETCH_TIMEOUT_MS = 5_000;
const MAX_RETRIES = 2;

async function fetchHtml(url: string, logger: Logger): Promise<string | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'NewsAggregator/1.0 (+https://newssummary.app)' },
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      clearTimeout(timeoutId);
      logger.warn(`${SOURCE} fetch attempt ${attempt}/${MAX_RETRIES} failed: ${(err as Error).message}`);
      if (attempt === MAX_RETRIES) return null;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  return null;
}

function resolveUrl(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) return href;
  if (href.startsWith('//')) return `https:${href}`;
  return `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
}

function normalizeImageUrl(src: string | undefined | null): string | null {
  if (!src) return null;
  const candidate = src.startsWith('//') ? `https:${src}` : src;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function scrapeKigaliToday(logger: Logger): Promise<NormalizedArticle[]> {
  const html = await fetchHtml(LISTING_URL, logger);
  if (!html) return [];

  const $ = cheerio.load(html);
  const articles: NormalizedArticle[] = [];

  // Try selectors in priority order; use first that yields 2+ results
  const selectors = [
    'article',
    '.article-item',
    '.news-item',
    '.post',
    '.entry',
    'div[class*="article"]',
    'div[class*="news"]',
    '.item',
  ];

  let elements = selectors
    .map((sel) => $(sel).toArray())
    .find((found) => found.length >= 2) ?? [];

  // Fallback: grab parent containers of heading links
  if (elements.length === 0) {
    elements = $('h2 a, h3 a, h4 a')
      .toArray()
      .map((a) => $(a).closest('div, li, section').get(0))
      .filter((el): el is NonNullable<typeof el> => el != null);
  }

  for (const el of elements.slice(0, SCRAPE_LIMIT)) {
    try {
      const $el = $(el);

      const linkEl = $el.find('a[href]').first();
      const href = linkEl.attr('href') ?? '';
      if (!href) continue;

      const articleUrl = resolveUrl(href);
      if (!articleUrl) continue;

      const title = (
        $el.find('h1, h2, h3, h4').first().text().trim() ||
        linkEl.text().trim()
      );
      if (!title || title.length < 5) continue;

      const imageEl = $el.find('img').first();
      const imageSrc =
        imageEl.attr('src') ??
        imageEl.attr('data-src') ??
        imageEl.attr('data-lazy-src');
      const imageUrl = normalizeImageUrl(imageSrc);

      const dateEl = $el.find('time, .date, .time, [datetime], .published').first();
      const dateStr = dateEl.attr('datetime') ?? dateEl.text().trim();
      const publishedAt = dateStr ? new Date(dateStr) : new Date();

      const excerpt = $el
        .find('p, .excerpt, .summary, .description, .intro')
        .first()
        .text()
        .trim();
      const content = excerpt.length > 20 ? excerpt : title;

      articles.push({
        title: title.substring(0, 500),
        content,
        imageUrl,
        url: articleUrl,
        source: SOURCE,
        originalLanguage: 'rw',
        publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
      });
    } catch (err) {
      logger.warn(`${SOURCE}: failed to parse element — ${(err as Error).message}`);
    }
  }

  logger.log(`${SOURCE}: scraped ${articles.length} articles`);
  return articles;
}
