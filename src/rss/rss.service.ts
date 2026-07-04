import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import RssParser = require('rss-parser');
import {
  RSS_FEEDS,
  RssFeedConfig,
  SupportedLanguage,
} from './rss-feeds.config';
import { fetchHtml } from '../common/util/http-fetch.util';
import {
  extractBestImageFromArticleHtml,
  extractRssItemImageCandidates,
  pickBestImageCandidate,
} from '../common/util/image-extractor.util';
import { recordPickPhase } from '../common/util/image-ingest-metrics.util';

export interface NormalizedArticle {
  title: string;
  content: string;
  imageUrl: string | null;
  url: string;
  source: string;
  originalLanguage: SupportedLanguage;
  publishedAt: Date;
  continent: string;
  region: string;
  country: string;
  /**
   * How the article was fetched. RSS items are short-but-valid by feed contract;
   * scraped items get a stricter quality gate (broken HTML extraction). Defaults
   * to undefined for older callers; the insert gate treats that conservatively.
   */
  via?: 'rss' | 'scrape';
}

@Injectable()
export class RssService {
  private readonly logger = new Logger(RssService.name);
  private readonly parser = new RssParser({
    // Some Rwandan feeds (e.g. imvahonshya.co.rw) respond in ~15-20s. Feeds are
    // fetched in parallel (Promise.allSettled), so a generous per-feed timeout
    // only bounds the worst-case completion of this background job — it does not
    // slow down the fast feeds. 10s was dropping Imvaho Nshya entirely.
    timeout: 30000,
    // Use a real browser User-Agent: Igihe's SPIP backend feed returns an empty
    // body to a generic/bot UA, which would silently starve RW news. Mainstream
    // feeds (BBC, RFI, …) are unaffected by this.
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NewsSummary/1.0',
    },
    customFields: {
      item: [
        ['media:content', 'media:content', { keepArray: true }],
        ['media:thumbnail', 'media:thumbnail', { keepArray: true }],
      ],
    },
  });

  async fetchAllFeeds(): Promise<NormalizedArticle[]> {
    const results = await Promise.allSettled(
      RSS_FEEDS.map((feed) => this.fetchFeed(feed)),
    );

    const articles: NormalizedArticle[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        articles.push(...result.value);
      }
    }

    this.logger.log(
      `Fetched ${articles.length} total articles from ${RSS_FEEDS.length} feeds`,
    );
    return articles;
  }

  private async fetchFeed(feed: RssFeedConfig): Promise<NormalizedArticle[]> {
    try {
      const parsed = await this.parser.parseURL(feed.url);
      const items = (parsed.items ?? [])
        .filter((item) => item.title && (item.link || item.guid))
        .slice(0, 30);
      const articles = await this.mapPool(items, 5, (item) =>
        this.normalize(item, feed),
      );

      this.logger.debug(`${feed.name}: ${articles.length} articles fetched`);
      return articles;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch feed "${feed.name}": ${(error as Error).message}`,
      );
      return [];
    }
  }

  private async normalize(
    item: RssParser.Item,
    feed: RssFeedConfig,
  ): Promise<NormalizedArticle> {
    // Prefer the richest text available; many feeds only expose a snippet
    const rawContentValue =
      (item as RssParser.Item & { 'content:encoded'?: unknown })[
        'content:encoded'
      ] ??
      item.content ??
      item.contentSnippet ??
      item.summary ??
      '';
    const rawContent =
      typeof rawContentValue === 'string' ? rawContentValue : '';

    const cleaned = this.stripHtml(rawContent).trim();

    // Ensure Gemini always receives enough text — fall back to title when body is absent
    const content = cleaned.length > 20 ? cleaned : (item.title ?? '');
    const articleLink = item.link ?? item.guid ?? '';
    let feedOrigin: string;
    try {
      feedOrigin = new URL(feed.url).origin;
    } catch {
      feedOrigin = 'https://invalid.invalid';
    }
    const candidates = extractRssItemImageCandidates(
      item,
      articleLink || feedOrigin,
      feedOrigin,
    );
    const picked = pickBestImageCandidate(
      candidates,
      (item.title ?? '').trim(),
    );
    let imageUrl = picked?.url ?? null;

    if (!imageUrl && articleLink) {
      imageUrl = await this.extractImageFromArticlePage(
        articleLink,
        item.title ?? '',
      );
    }

    let itemDomain = '';
    try {
      itemDomain = new URL(articleLink || feedOrigin).hostname;
    } catch {
      itemDomain = '';
    }
    if (imageUrl) {
      recordPickPhase(itemDomain, 'chosen');
    } else if (candidates.length === 0) {
      recordPickPhase(itemDomain, 'no_candidates');
    } else {
      recordPickPhase(itemDomain, 'null_after_candidates');
    }

    const url = articleLink;

    const publishedAt = item.pubDate
      ? new Date(item.pubDate)
      : item.isoDate
        ? new Date(item.isoDate)
        : new Date();

    return {
      title: (item.title ?? '').trim(),
      content,
      imageUrl,
      url,
      source: feed.name,
      originalLanguage: feed.language,
      publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
      continent: feed.continent,
      region: feed.region,
      country: feed.country,
      via: 'rss',
    };
  }

  private async extractImageFromArticlePage(
    articleUrl: string,
    title: string,
  ): Promise<string | null> {
    const html = await fetchHtml(
      articleUrl,
      'RSS image fallback',
      this.logger,
      {
        timeoutMs: 12_000,
        maxRetries: 1,
        curlFallback: true,
      },
    );
    if (!html || html.length < 400) return null;
    return extractBestImageFromArticleHtml(html, articleUrl, title);
  }

  private async mapPool<T, R>(
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

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-z]+;/gi, ' ')
      .trim();
  }
}
