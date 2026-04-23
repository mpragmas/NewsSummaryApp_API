import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import RssParser = require('rss-parser');
import { RSS_FEEDS, RssFeedConfig, SupportedLanguage } from './rss-feeds.config';

export interface NormalizedArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  originalLanguage: SupportedLanguage;
  publishedAt: Date;
  continent: string;
  region: string;
  country: string;
}

@Injectable()
export class RssService {
  private readonly logger = new Logger(RssService.name);
  private readonly parser = new RssParser({
    timeout: 10000,
    headers: { 'User-Agent': 'NewsAggregator/1.0' },
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

    this.logger.log(`Fetched ${articles.length} total articles from ${RSS_FEEDS.length} feeds`);
    return articles;
  }

  private async fetchFeed(feed: RssFeedConfig): Promise<NormalizedArticle[]> {
    try {
      const parsed = await this.parser.parseURL(feed.url);
      const articles = (parsed.items ?? [])
        .filter((item) => item.title && (item.link || item.guid))
        .map((item) => this.normalize(item, feed));

      this.logger.debug(`${feed.name}: ${articles.length} articles fetched`);
      return articles;
    } catch (error) {
      this.logger.warn(`Failed to fetch feed "${feed.name}": ${(error as Error).message}`);
      return [];
    }
  }

  private normalize(item: RssParser.Item, feed: RssFeedConfig): NormalizedArticle {
    // Prefer the richest text available; many feeds only expose a snippet
    const rawContent =
      item['content:encoded'] ??
      item.content ??
      item.contentSnippet ??
      item.summary ??
      '';

    const cleaned = this.stripHtml(rawContent).trim();

    // Ensure Gemini always receives enough text — fall back to title when body is absent
    const content = cleaned.length > 20 ? cleaned : (item.title ?? '');

    const url = item.link ?? item.guid ?? '';

    const publishedAt = item.pubDate
      ? new Date(item.pubDate)
      : item.isoDate
        ? new Date(item.isoDate)
        : new Date();

    return {
      title: (item.title ?? '').trim(),
      content,
      url,
      source: feed.name,
      originalLanguage: feed.language,
      publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
      continent: feed.continent,
      region: feed.region,
      country: feed.country,
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  }
}
