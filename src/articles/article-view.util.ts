import { ArticleResponseDto } from './dto/article-response.dto';
import { sanitizeImageUrl } from '../common/util/image-quality.util';
import { localizeCategory } from './category-i18n.util';
import { SupportedLang } from '../ai/prompts';

/**
 * Pure view mappers shared by ArticlesService and StoriesService.
 *
 * Extracted so story responses present articles identically to the
 * `/articles` endpoints (same language-fallback chain, image sanitization and
 * category localization) without duplicating logic.
 */

/**
 * Pick the best summary for the requested language using the same fallback
 * chain as the mobile app (the rw catalog is smaller — avoid empty cards while
 * summaryRw is still queued).
 */
export function applyLanguageView(
  article: ArticleResponseDto,
  lang?: 'en' | 'fr' | 'rw',
): ArticleResponseDto {
  if (!lang) return article;

  let requestedSummary: string | null;
  if (lang === 'rw') {
    requestedSummary =
      article.summaryRw ?? article.summary ?? article.summaryFr ?? null;
  } else if (lang === 'fr') {
    requestedSummary =
      article.summaryFr ?? article.summary ?? article.summaryRw ?? null;
  } else {
    requestedSummary =
      article.summary ?? article.summaryFr ?? article.summaryRw ?? null;
  }

  return { ...article, summary: requestedSummary };
}

/** Sanitize the hero image and localize the category label for display. */
export function normalizeArticleResponse(
  article: ArticleResponseDto,
  lang?: SupportedLang,
): ArticleResponseDto {
  return {
    ...article,
    imageUrl: sanitizeImageUrl(article.imageUrl),
    category: localizeCategory(article.category, lang),
  };
}

/** Convenience: apply language view + normalize in one pass. */
export function toArticleView(
  article: ArticleResponseDto,
  lang?: 'en' | 'fr' | 'rw',
): ArticleResponseDto {
  return normalizeArticleResponse(applyLanguageView(article, lang), lang);
}
