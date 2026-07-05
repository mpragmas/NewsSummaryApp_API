import { sanitizeImageUrl } from './image-quality.util';

type ArticleImageLike = {
  imageUrl?: string | null;
  category?: string | null;
  source?: string | null;
  originalLanguage?: string | null;
};

const FALLBACK_IMAGES = {
  rw: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=80',
  fr: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
  en: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  sports:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  business:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  technology:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  health:
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  politics:
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
};

export function articleImageOrFallback(article: ArticleImageLike): string {
  const sanitized = sanitizeImageUrl(article.imageUrl);
  if (sanitized) return sanitized;

  const text =
    `${article.category ?? ''} ${article.source ?? ''}`.toLowerCase();
  if (/sport|imikino/.test(text)) return FALLBACK_IMAGES.sports;
  if (/business|econom|ubukungu/.test(text)) return FALLBACK_IMAGES.business;
  if (/tech|ikoranabuhanga/.test(text)) return FALLBACK_IMAGES.technology;
  if (/health|sant|ubuzima/.test(text)) return FALLBACK_IMAGES.health;
  if (/politic|politique|politiki/.test(text)) return FALLBACK_IMAGES.politics;

  if (article.originalLanguage === 'rw') return FALLBACK_IMAGES.rw;
  if (article.originalLanguage === 'fr') return FALLBACK_IMAGES.fr;
  return FALLBACK_IMAGES.en;
}
