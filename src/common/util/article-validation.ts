import type { NormalizedArticle } from '../../rss/rss.service';

export const DATE_TITLE_REGEX = /^\d{2}\/\d{2}$/;
const NAV_PATTERNS = [/read more/i, /click here/i, /share this/i];

export interface ArticleValidationOptions {
  minContentLength?: number;
}

export interface ContentQualityResult {
  ok: boolean;
  reason?: 'invalid' | 'low_quality';
  code?:
    | 'content_too_short'
    | 'repeated_words'
    | 'navigation_text'
    | 'title_equals_content'
    | 'title_repeated';
}

export function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

export function isDateLikeTitle(title: string): boolean {
  return DATE_TITLE_REGEX.test(normalizeText(title));
}

export function isNumericOnlyTitle(title: string): boolean {
  return /^[\d\s./:-]+$/.test(normalizeText(title));
}

export function isMeaningfulTitle(title: string): boolean {
  const normalized = normalizeText(title);
  return (
    normalized.length > 5 &&
    !isDateLikeTitle(normalized) &&
    !isNumericOnlyTitle(normalized)
  );
}

export function isValidHttpUrl(url: string | null | undefined): boolean {
  const normalized = normalizeText(url);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function parsePublishedAt(raw: string | null | undefined): Date {
  const normalized = normalizeText(raw);
  const parsed = normalized ? new Date(normalized) : new Date();
  if (!isValidPublishedAt(parsed)) return new Date();
  return parsed;
}

export function isValidPublishedAt(date: Date | null | undefined): boolean {
  if (!date || Number.isNaN(date.getTime())) return false;
  return date.getUTCFullYear() >= 2010;
}

export function isValidArticle(
  article: Pick<NormalizedArticle, 'title' | 'content' | 'url' | 'publishedAt'>,
  options: ArticleValidationOptions = {},
): boolean {
  const minContentLength = options.minContentLength ?? 250;
  const title = normalizeText(article.title);
  const content = normalizeText(article.content);
  return (
    isMeaningfulTitle(title) &&
    content.length >= minContentLength &&
    isValidHttpUrl(article.url) &&
    isValidPublishedAt(article.publishedAt)
  );
}

export function sanitizeContentForAI(content: string): string {
  const normalized = (content ?? '')
    // remove obvious html-like markup remains
    .replace(/<[^>]+>/g, ' ')
    // strip common boilerplate
    .replace(/\b(all rights reserved|copyright)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // remove duplicate lines/segments while preserving order
  const parts = normalized
    .split(/(?<=[.!?])\s+|\n+/)
    .map((p) => normalizeText(p))
    .filter(Boolean);
  const seen = new Set<string>();
  const deduped = parts.filter((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // remove obvious nav junk segments
  const cleaned = deduped
    .filter((part) => !NAV_PATTERNS.some((pattern) => pattern.test(part)))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

export function repeatedWordRatio(content: string): number {
  const words = normalizeText(content)
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);
  if (words.length === 0) return 1;
  const unique = new Set(words).size;
  return 1 - unique / words.length;
}

export function titleOccurrenceCount(title: string, content: string): number {
  const t = normalizeText(title).toLowerCase();
  const c = normalizeText(content).toLowerCase();
  if (!t || !c) return 0;
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = c.match(new RegExp(escaped, 'g'));
  return matches?.length ?? 0;
}

export function hasRealJournalisticContent(content: string, title?: string): boolean {
  const normalized = normalizeText(content);
  if (normalized.length < 250) return false;
  if (NAV_PATTERNS.some((pattern) => pattern.test(normalized))) return false;

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30);
  if (sentences.length < 2) return false;

  if (title) {
    const titleNorm = normalizeText(title).toLowerCase();
    const contentNorm = normalized.toLowerCase();
    if (titleNorm && contentNorm === titleNorm) return false;
    if (titleOccurrenceCount(titleNorm, contentNorm) > 2) return false;
  }

  return true;
}

export function getContentQualityScore(
  title: string,
  content: string,
  options: ArticleValidationOptions = {},
): ContentQualityResult {
  const minContentLength = options.minContentLength ?? 250;
  const cleanTitle = normalizeText(title);
  const cleanContent = normalizeText(content);

  if (cleanContent.length < minContentLength) {
    return { ok: false, reason: 'low_quality', code: 'content_too_short' };
  }
  if (repeatedWordRatio(cleanContent) > 0.4) {
    return { ok: false, reason: 'low_quality', code: 'repeated_words' };
  }
  if (NAV_PATTERNS.some((pattern) => pattern.test(cleanContent))) {
    return { ok: false, reason: 'low_quality', code: 'navigation_text' };
  }
  if (
    cleanTitle &&
    cleanContent &&
    cleanTitle.toLowerCase() === cleanContent.toLowerCase()
  ) {
    return { ok: false, reason: 'low_quality', code: 'title_equals_content' };
  }
  if (titleOccurrenceCount(cleanTitle, cleanContent) > 2) {
    return { ok: false, reason: 'low_quality', code: 'title_repeated' };
  }

  return { ok: true };
}
