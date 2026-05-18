import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import type { Item } from 'rss-parser';

import {
  recordPickPhase,
  recordUrlNormalization,
} from './image-ingest-metrics.util';

/** Where the candidate originated — higher trust sources are preferred when scores tie. */
export type ImageCandidateSource =
  | 'rss-media-content'
  | 'rss-media-thumbnail'
  | 'rss-enclosure'
  | 'meta-og-image'
  | 'meta-twitter-image'
  | 'json-ld'
  | 'article-img'
  | 'article-img-body';

export interface ImageCandidate {
  url: string;
  alt?: string;
  titleAttr?: string;
  source: ImageCandidateSource;
  /** Approximate intrinsic priority before title scoring (0–120). */
  trustHint: number;
}

/** Hosts where body/lazy images are prioritized (RW + East Africa news). */
const REGIONAL_NEWS_HOST_SUFFIXES = [
  'igihe.com',
  'igihe.net',
  'igihe.org',
  'kigalitoday.com',
  'newtimes.co.rw',
  'nation.africa',
] as const;

export function isRegionalNewsHost(hostname: string): boolean {
  const h = hostname.replace(/^www\./i, '').toLowerCase();
  return REGIONAL_NEWS_HOST_SUFFIXES.some((s) => h === s || h.endsWith(`.${s}`));
}

/**
 * High-confidence junk only (avoid broad substrings like "banner" / "default"
 * that appear in legitimate photo URLs).
 */
function highConfidenceRejectReason(url: string): string | null {
  try {
    const u = new URL(url.trim().startsWith('//') ? `https:${url.trim()}` : url.trim());
    const host = u.hostname.toLowerCase();
    const path = u.pathname.toLowerCase();

    if (
      /doubleclick\.net|googlesyndication\.com|googleadservices\.com|2mdn\.net/i.test(
        host,
      )
    ) {
      return 'ad_network_host';
    }
    if (path.endsWith('.svg') || path.includes('.svg?')) return 'svg';
    if (/favicon|browserconfig\.xml|apple-touch-icon/i.test(path)) return 'favicon_path';
    if (/\/(ads?|advert)\//i.test(path)) return 'ad_path_segment';
    if (/sprite|spritesheet/i.test(path)) return 'sprite_asset';
    if (
      /(^|\/)1x1[-._]?|pixel\.gif|blank\.gif|spacer\.gif|clear\.gif|transparent\.gif/i.test(
        path,
      )
    ) {
      return 'tracking_pixel_filename';
    }
    if (
      /\/(site-logo|brand-logo|header-logo|navbar-logo|logo-nav)(\/|$)/i.test(path) ||
      /logo[_-]?(white|dark|footer|header)\./i.test(path)
    ) {
      return 'brand_logo_path';
    }
    if (
      /placeholder|no[-_]?image|missing[-_]?image|image[-_]?placeholder/i.test(
        path,
      )
    ) {
      return 'placeholder_path';
    }

    const w = Number(u.searchParams.get('w') ?? u.searchParams.get('width'));
    const h = Number(u.searchParams.get('h') ?? u.searchParams.get('height'));
    if (!Number.isNaN(w) && !Number.isNaN(h) && w > 0 && h > 0 && w <= 16 && h <= 16) {
      return 'tiny_dimensions_query';
    }

    return null;
  } catch {
    return 'invalid_url';
  }
}

const META_SOURCE_RANK: Record<ImageCandidateSource, number> = {
  'meta-og-image': 100,
  'meta-twitter-image': 98,
  'rss-media-content': 94,
  'rss-enclosure': 88,
  'json-ld': 84,
  'article-img-body': 78,
  'article-img': 62,
  'rss-media-thumbnail': 36,
};

const TRACKING_QUERY_KEYS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
]);

const CDN_SIZE_KEYS = new Set([
  'w',
  'h',
  'width',
  'height',
  'resize',
  'quality',
  'q',
  'auto',
  'fit',
  'crop',
  'ixlib',
  'fm',
  'blur',
]);

/** Strip noisy tracking + CDN transform tokens for dedupe (not for rejecting URLs). */
export function fingerprintCanonicalImageUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const clone = new URL(u.href);
    for (const key of [...clone.searchParams.keys()]) {
      const low = key.toLowerCase();
      if (TRACKING_QUERY_KEYS.has(low) || CDN_SIZE_KEYS.has(low)) {
        clone.searchParams.delete(key);
      }
    }
    const host = clone.hostname.replace(/^www\./i, '').toLowerCase();
    return `${host}${clone.pathname}`;
  } catch {
    return url.trim().toLowerCase();
  }
}

/** Composite dedupe key: same asset on same site (paths normalized). */
export function fingerprintDedupeComposite(url: string): string {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./i, '').toLowerCase();
    return `${host}|${fingerprintCanonicalImageUrl(url)}`;
  } catch {
    return fingerprintCanonicalImageUrl(url);
  }
}

export interface ParseImageUrlResult {
  url: string | null;
  rejectReason?: string;
}

/** Parse + clean URL without side effects (used while ranking candidates). */
export function parseImageUrl(raw: string | null | undefined): ParseImageUrlResult {
  const trimmed = raw?.trim();
  if (!trimmed) return { url: null };
  const candidate = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { url: null, rejectReason: 'non_http_protocol' };
    }

    for (const key of [...parsed.searchParams.keys()]) {
      if (TRACKING_QUERY_KEYS.has(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }

    const built = parsed.toString();
    const reject = highConfidenceRejectReason(built);
    if (reject) {
      if (process.env.IMAGE_EXTRACTION_DEBUG === '1') {
        // eslint-disable-next-line no-console
        console.debug(
          `[image-reject] rule=${reject} domain=${parsed.hostname} url=${built.slice(0, 180)}`,
        );
      }
      return { url: null, rejectReason: reject };
    }

    return { url: built };
  } catch {
    return { url: null, rejectReason: 'invalid_url' };
  }
}

/** Final normalization for persistence — records accept/reject metrics once. */
export function normalizeImageUrlStrict(
  url: string | null | undefined,
): string | null {
  const r = parseImageUrl(url);
  if (!r.url) {
    if (url?.trim()) {
      recordUrlNormalization(url, false, r.rejectReason ?? 'unknown');
    }
    return null;
  }
  recordUrlNormalization(r.url, true);
  return r.url;
}

export function resolveToAbsoluteUrl(href: string, baseUrl: string): string | null {
  const h = href.trim();
  if (!h || h.startsWith('data:') || h.startsWith('javascript:')) return null;
  try {
    const resolved = new URL(h, baseUrl);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
    return resolved.toString();
  } catch {
    return null;
  }
}

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  return new Set(words);
}

/** Score overlap between article title and image alt/title (0–50+). */
export function scoreTitleImageMatch(
  articleTitle: string,
  alt: string | undefined,
  titleAttr: string | undefined,
): number {
  const tt = tokenize(articleTitle);
  if (tt.size === 0) return 0;
  let score = 0;
  for (const blob of [alt, titleAttr]) {
    if (!blob) continue;
    for (const w of tokenize(blob)) {
      if (tt.has(w)) score += 6;
    }
  }
  return score;
}

function scoreUrlPathMatch(articleTitle: string, imageUrl: string): number {
  let score = 0;
  try {
    const path = new URL(imageUrl).pathname.toLowerCase();
    const slugParts = path.split(/[/_.-]+/).filter((p) => p.length > 3);
    const tt = tokenize(articleTitle);
    for (const part of slugParts) {
      if (tt.has(part)) score += 4;
    }
  } catch {
    /* ignore */
  }
  return score;
}

export function pickBestImageCandidate(
  candidates: ImageCandidate[],
  articleTitle: string,
): ImageCandidate | null {
  const normalized: ImageCandidate[] = [];
  for (const c of candidates) {
    const parsed = parseImageUrl(c.url);
    if (!parsed.url) {
      if (c.url?.trim()) {
        recordUrlNormalization(c.url, false, parsed.rejectReason ?? 'unknown');
      }
      continue;
    }
    normalized.push({ ...c, url: parsed.url });
  }

  if (normalized.length === 0) return null;

  const scored = normalized.map((c) => {
    const titleMatch =
      scoreTitleImageMatch(articleTitle, c.alt, c.titleAttr) +
      scoreUrlPathMatch(articleTitle, c.url);
    const trust = META_SOURCE_RANK[c.source] ?? 50;
    const lowTrustImg =
      (c.source === 'article-img' || c.source === 'article-img-body') &&
      titleMatch === 0
        ? -6
        : 0;
    const total = trust + titleMatch + lowTrustImg;
    return { c, total, titleMatch };
  });

  scored.sort((a, b) => b.total - a.total);
  return scored[0]?.c ?? null;
}

function coerceMediaTagUrl(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw.trim() || null;
  if (typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.url === 'string') return o.url;
  const attrs = o.$ as Record<string, unknown> | undefined;
  if (attrs && typeof attrs.url === 'string') return attrs.url;
  if (attrs && typeof attrs.href === 'string') return attrs.href;
  return null;
}

function flattenOneMediaKey(item: unknown, key: string): unknown[] {
  const row = item as Record<string, unknown>;
  const v = row[key];
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? [...v] : [v];
}

function enclosureImageUrl(item: Item): string | null {
  const enc = item.enclosure;
  if (!enc) return null;
  const url = typeof enc.url === 'string' ? enc.url : null;
  const type = typeof enc.type === 'string' ? enc.type.toLowerCase() : '';
  if (!url) return null;
  if (type && !type.startsWith('image/') && !type.includes('jpeg') && !type.includes('png') && !type.includes('webp')) {
    if (!type.includes('octet')) return null;
  }
  return url;
}

function extractImgSrcFromHtml(html: string): ImageCandidate[] {
  if (!html || !html.includes('<')) return [];
  const $ = cheerio.load(html);
  const out: ImageCandidate[] = [];
  $('img').each((_, el) => {
    const $img = $(el);
    const raw =
      $img.attr('data-src') ??
      $img.attr('data-lazy-src') ??
      $img.attr('data-original') ??
      $img.attr('data-srcset')?.split(',')[0]?.trim().split(/\s+/)[0] ??
      $img.attr('srcset')?.split(',').pop()?.trim().split(/\s+/)[0] ??
      $img.attr('src');
    if (!raw) return;
    out.push({
      url: raw,
      alt: $img.attr('alt') ?? undefined,
      titleAttr: $img.attr('title') ?? undefined,
      source: 'article-img',
      trustHint: META_SOURCE_RANK['article-img'],
    });
  });
  return out;
}

function extractOgTwitterFromHtml(html: string): ImageCandidate[] {
  if (!html) return [];
  const $ = cheerio.load(html);
  const out: ImageCandidate[] = [];
  const og = $('meta[property="og:image"]').attr('content');
  if (og)
    out.push({
      url: og,
      source: 'meta-og-image',
      trustHint: META_SOURCE_RANK['meta-og-image'],
    });
  const tw =
    $('meta[name="twitter:image"]').attr('content') ??
    $('meta[name="twitter:image:src"]').attr('content');
  if (tw)
    out.push({
      url: tw,
      source: 'meta-twitter-image',
      trustHint: META_SOURCE_RANK['meta-twitter-image'],
    });
  return out;
}

function extractJsonLdImages(html: string): ImageCandidate[] {
  const results: ImageCandidate[] = [];
  if (!html.includes('application/ld+json')) return results;
  const $ = cheerio.load(html);
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html();
    if (!raw) return;
    try {
      const data = JSON.parse(raw.trim()) as unknown;
      collectJsonLdImageValues(data, results);
    } catch {
      /* skip invalid JSON */
    }
  });
  return results;
}

function collectJsonLdImageValues(node: unknown, acc: ImageCandidate[]): void {
  if (node === null || node === undefined) return;
  if (typeof node === 'string') {
    if (node.startsWith('http')) {
      acc.push({
        url: node,
        source: 'json-ld',
        trustHint: META_SOURCE_RANK['json-ld'],
      });
    }
    return;
  }
  if (Array.isArray(node)) {
    for (const n of node) collectJsonLdImageValues(n, acc);
    return;
  }
  if (typeof node === 'object') {
    const o = node as Record<string, unknown>;
    if (typeof o.image === 'string' || Array.isArray(o.image)) {
      collectJsonLdImageValues(o.image, acc);
    }
    if (typeof o.image === 'object' && o.image !== null) {
      const imgObj = o.image as Record<string, unknown>;
      if (typeof imgObj.url === 'string') {
        acc.push({
          url: imgObj.url,
          source: 'json-ld',
          trustHint: META_SOURCE_RANK['json-ld'],
        });
      }
    }
    for (const v of Object.values(o)) {
      if (typeof v === 'object') collectJsonLdImageValues(v, acc);
    }
  }
}

/**
 * RSS item image extraction — tries media:content → media:thumbnail → enclosure → HTML embedded imgs & meta (from description).
 */
export function extractRssItemImageCandidates(
  item: Item,
  articleLink: string,
  feedSiteOrigin: string,
): ImageCandidate[] {
  const base = (() => {
    try {
      return new URL(articleLink).origin;
    } catch {
      return feedSiteOrigin;
    }
  })();

  const candidates: ImageCandidate[] = [];

  /* Order matches requested fallback: media:content → enclosure → og/json/img inside HTML → media:thumbnail last */
  for (const raw of flattenOneMediaKey(item, 'media:content')) {
    const url = coerceMediaTagUrl(raw);
    if (!url) continue;
    const resolved =
      resolveToAbsoluteUrl(url, base) ?? resolveToAbsoluteUrl(url, feedSiteOrigin);
    if (resolved) {
      candidates.push({
        url: resolved,
        source: 'rss-media-content',
        trustHint: META_SOURCE_RANK['rss-media-content'],
      });
    }
  }

  const encUrl = enclosureImageUrl(item);
  if (encUrl) {
    const resolved =
      resolveToAbsoluteUrl(encUrl, base) ?? resolveToAbsoluteUrl(encUrl, feedSiteOrigin);
    if (resolved) {
      candidates.push({
        url: resolved,
        source: 'rss-enclosure',
        trustHint: META_SOURCE_RANK['rss-enclosure'],
      });
    }
  }

  const rawContent =
    (item as Record<string, unknown>)['content:encoded'] ??
    item.content ??
    '';
  const htmlBlob = typeof rawContent === 'string' ? rawContent : '';

  candidates.push(...extractOgTwitterFromHtml(htmlBlob));
  candidates.push(...extractJsonLdImages(htmlBlob));

  for (const img of extractImgSrcFromHtml(htmlBlob)) {
    const resolved =
      resolveToAbsoluteUrl(img.url, base) ??
      resolveToAbsoluteUrl(img.url, feedSiteOrigin);
    if (resolved) {
      candidates.push({
        ...img,
        url: resolved,
      });
    }
  }

  for (const raw of flattenOneMediaKey(item, 'media:thumbnail')) {
    const url = coerceMediaTagUrl(raw);
    if (!url) continue;
    const resolved =
      resolveToAbsoluteUrl(url, base) ?? resolveToAbsoluteUrl(url, feedSiteOrigin);
    if (resolved) {
      candidates.push({
        url: resolved,
        source: 'rss-media-thumbnail',
        trustHint: META_SOURCE_RANK['rss-media-thumbnail'],
      });
    }
  }

  return candidates;
}

function gatherCandidatesFromCheerio(
  $: CheerioAPI,
  pageUrl: string,
): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];
  let origin = '';
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    /* ignore */
  }

  const og = $('meta[property="og:image"]').attr('content');
  if (og) {
    const r = resolveToAbsoluteUrl(og, pageUrl) ?? resolveToAbsoluteUrl(og, origin + '/');
    if (r)
      candidates.push({
        url: r,
        source: 'meta-og-image',
        trustHint: META_SOURCE_RANK['meta-og-image'],
      });
  }

  const tw =
    $('meta[name="twitter:image"]').attr('content') ??
    $('meta[name="twitter:image:src"]').attr('content');
  if (tw) {
    const r = resolveToAbsoluteUrl(tw, pageUrl) ?? resolveToAbsoluteUrl(tw, origin + '/');
    if (r)
      candidates.push({
        url: r,
        source: 'meta-twitter-image',
        trustHint: META_SOURCE_RANK['meta-twitter-image'],
      });
  }

  const html = $.root().html() ?? '';
  candidates.push(...extractJsonLdImages(html));

  const skipSelectors =
    'header img, nav img, footer img, .site-logo img, .logo img, .navbar img, [class*="site-header"] img';

  $('article img, main img, [role="main"] img')
    .not(skipSelectors)
    .each((_, el) => {
      const $img = $(el);
      if ($img.closest(skipSelectors).length) return;

      const raw =
        $img.attr('data-src') ??
        $img.attr('data-lazy-src') ??
        $img.attr('data-original') ??
        $img.attr('data-full-src') ??
        bestUrlFromSrcset($img.attr('data-srcset') ?? $img.attr('srcset')) ??
        $img.attr('src');

      if (!raw) return;

      const resolved =
        resolveToAbsoluteUrl(raw, pageUrl) ??
        resolveToAbsoluteUrl(raw, origin ? `${origin}/` : pageUrl);
      if (!resolved) return;

      candidates.push({
        url: resolved,
        alt: $img.attr('alt') ?? undefined,
        titleAttr: $img.attr('title') ?? undefined,
        source: 'article-img',
        trustHint: META_SOURCE_RANK['article-img'],
      });
    });

  return candidates;
}

/** Extra body images for RW / regional publishers (lazy-load friendly). */
export function gatherRegionalArticleImages(
  $: CheerioAPI,
  pageUrl: string,
): ImageCandidate[] {
  const out: ImageCandidate[] = [];
  let origin = '';
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    return out;
  }

  const selectors =
    '.article-body img, .post-content img, .entry-content img, .article__content img, .story-body img, .news-detail img, .article-text img, .field--name-body img, .node__content img';

  $(selectors).each((_, el) => {
    const $img = $(el);
    if ($img.closest('header, nav, footer, [role="navigation"]').length) return;

    const raw =
      $img.attr('data-src') ??
      $img.attr('data-lazy-src') ??
      $img.attr('data-original') ??
      $img.attr('data-full-src') ??
      bestUrlFromSrcset($img.attr('data-srcset') ?? $img.attr('srcset')) ??
      $img.attr('src');
    if (!raw) return;

    const resolved =
      resolveToAbsoluteUrl(raw, pageUrl) ??
      resolveToAbsoluteUrl(raw, origin + '/');
    if (!resolved) return;

    out.push({
      url: resolved,
      alt: $img.attr('alt') ?? undefined,
      titleAttr: $img.attr('title') ?? undefined,
      source: 'article-img-body',
      trustHint: META_SOURCE_RANK['article-img-body'],
    });
  });

  return out;
}

const RASTER_EXT_RE = /\.(jpe?g|webp|png)(\?|#|$)/i;

function fallbackLargestRasterNearContent(
  $: CheerioAPI,
  pageUrl: string,
): string | null {
  let origin = '';
  try {
    origin = new URL(pageUrl).origin;
  } catch {
    return null;
  }

  const $scope = $(
    'article .field--name-body, article .article-body, article .post-content, article .entry-content, article [itemprop="articleBody"], article',
  ).first();
  const scope = $scope.length ? $scope : $('main article, main, [role="main"]');

  const scored: { url: string; score: number }[] = [];

  scope.find('img').each((_, el) => {
    const $img = $(el);
    if ($img.closest('header, nav, footer, [role="navigation"]').length) return;

    const raw =
      $img.attr('data-src') ??
      $img.attr('data-lazy-src') ??
      $img.attr('data-original') ??
      $img.attr('data-full-src') ??
      bestUrlFromSrcset($img.attr('data-srcset') ?? $img.attr('srcset')) ??
      $img.attr('src');
    if (!raw) return;

    const resolved =
      resolveToAbsoluteUrl(raw, pageUrl) ??
      resolveToAbsoluteUrl(raw, origin + '/');
    if (!resolved) return;

    if (
      !RASTER_EXT_RE.test(resolved) &&
      !/\/upload|\/media|\/wp-content\/|\/images\/|\/sites\/default\/files\//i.test(
        resolved,
      )
    ) {
      return;
    }

    const p = parseImageUrl(resolved);
    if (!p.url) return;

    let score = 12;
    try {
      const u = new URL(p.url);
      const sw = Number(u.searchParams.get('w') ?? u.searchParams.get('width') ?? 0);
      const sh = Number(u.searchParams.get('h') ?? u.searchParams.get('height') ?? 0);
      if (!Number.isNaN(sw) && sw > 0) score += Math.min(sw, 2400) / 40;
      if (!Number.isNaN(sh) && sh > 0) score += Math.min(sh, 2400) / 40;
    } catch {
      /* ignore */
    }
    if (/webp|jpe?g/i.test(p.url)) score += 6;

    scored.push({ url: p.url, score });
  });

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.url ?? null;
}

function bestUrlFromSrcset(srcset: string | undefined): string | null {
  if (!srcset) return null;
  let bestUrl = '';
  let bestW = 0;
  for (const part of srcset.split(',')) {
    const bits = part.trim().split(/\s+/);
    const url = bits[0];
    const hint = bits[1] ?? '';
    const wMatch = hint.match(/(\d+)w/i);
    const w = wMatch ? parseInt(wMatch[1], 10) : 0;
    const xMatch = hint.match(/([\d.]+)x/i);
    const scale = xMatch ? parseFloat(xMatch[1]) * 1000 : 0;
    const rank = w || scale;
    if (rank >= bestW) {
      bestW = rank;
      bestUrl = url;
    }
  }
  return bestUrl || null;
}

/** Primary scraper entry: detail HTML → best image URL or null. */
export function extractBestImageFromArticleHtml(
  html: string,
  pageUrl: string,
  articleTitle: string,
): string | null {
  const $ = cheerio.load(html);
  return extractBestImageFromCheerioRoot($, pageUrl, articleTitle);
}

/** Avoid reloading HTML when cheerio instance already exists. */
export function extractBestImageFromCheerioRoot(
  $: CheerioAPI,
  pageUrl: string,
  articleTitle: string,
): string | null {
  let host = '';
  try {
    host = new URL(pageUrl).hostname;
  } catch {
    /* ignore */
  }

  let candidates = gatherCandidatesFromCheerio($, pageUrl);
  if (host && isRegionalNewsHost(host)) {
    candidates = [...candidates, ...gatherRegionalArticleImages($, pageUrl)];
  }

  const picked = pickBestImageCandidate(candidates, articleTitle);
  if (picked?.url) {
    recordPickPhase(host, 'chosen');
    return picked.url;
  }

  const fb = fallbackLargestRasterNearContent($, pageUrl);
  if (fb) {
    recordPickPhase(host, 'chosen');
    return fb;
  }

  if (candidates.length === 0) {
    recordPickPhase(host, 'no_candidates');
  } else {
    recordPickPhase(host, 'null_after_candidates');
  }
  return null;
}

export function extractFallbackOgOnly(html: string, pageUrl: string): string | null {
  const $ = cheerio.load(html);
  const og = $('meta[property="og:image"]').attr('content');
  if (!og) return null;
  const r =
    resolveToAbsoluteUrl(og, pageUrl) ??
    resolveToAbsoluteUrl(og, new URL(pageUrl).origin + '/');
  const p = parseImageUrl(r);
  return p.url ?? null;
}
