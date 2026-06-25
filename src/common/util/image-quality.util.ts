import {
  fingerprintDedupeComposite,
  normalizeImageUrlStrict,
  parseImageUrl,
} from './image-extractor.util';

/** @deprecated Prefer importing normalizeImageUrlStrict from image-extractor.util */
export function sanitizeImageUrl(
  url: string | null | undefined,
): string | null {
  return normalizeImageUrlStrict(url);
}

/** Explicit site-chrome directories (favicons, sprites, brand logos, icon sets). */
const GENERIC_DIR_RE =
  /\/(favicon|sprites?|placeholders?|avatar-default|brand-logo|site-logo|header-logo|nav-logo|navbar-logo)(\/|$)|\/icons?\//i;

/** Generic filenames like logo.png, icon-2.svg, placeholder.jpg, spacer.gif. */
const GENERIC_FILENAME_RE =
  /(^|\/)(logo|icon|favicon|placeholder|sprite|spacer|blank|avatar-default)([._-][^/]*)?\.(png|jpe?g|gif|webp|svg)$/i;

/**
 * True when a URL points at site chrome (logo/favicon/placeholder) rather than
 * story art. Used to keep logos out of cluster hero images and dedupe.
 *
 * NOTE: SPIP-based regional publishers (Igihe, Kigali Today) store *real* lead
 * photos under `/IMG/logo/<slug>.jpg` — "logo" there is the CMS term for the
 * article thumbnail, not a brand mark. We therefore never treat an `/IMG/…`
 * media path as generic unless the file itself is literally `logo.ext`/`icon.ext`.
 * This was previously discarding most Igihe hero images.
 */
export function isLikelyGenericAsset(url: string): boolean {
  const p = parseImageUrl(url);
  if (!p.url) return true;
  let path: string;
  try {
    path = new URL(p.url).pathname.toLowerCase();
  } catch {
    return true;
  }

  // SPIP/regional CMS media dir → real article images even under a "logo" subdir.
  const isCmsMediaPath = /\/img(\/|$)/.test(path);
  const isLiteralLogoFile = /(^|\/)(logo|icon)\.[a-z0-9]+$/.test(path);
  if (isCmsMediaPath && !isLiteralLogoFile) return false;

  return GENERIC_DIR_RE.test(path) || GENERIC_FILENAME_RE.test(path);
}

/**
 * Caps runaway duplicate **generic** hero images; allows higher repetition for
 * normal article imagery (same photo legitimately reused across related wires).
 */
export function dropOverusedImages<T extends { imageUrl: string | null }>(
  rows: T[],
  thresholdArticleImages = 14,
  thresholdGenericAssets = 6,
): T[] {
  const freqArticle = new Map<string, number>();
  const freqGeneric = new Map<string, number>();

  for (const row of rows) {
    if (!row.imageUrl) continue;
    const key = fingerprintDedupeComposite(row.imageUrl);
    if (isLikelyGenericAsset(row.imageUrl)) {
      freqGeneric.set(key, (freqGeneric.get(key) ?? 0) + 1);
    } else {
      freqArticle.set(key, (freqArticle.get(key) ?? 0) + 1);
    }
  }

  return rows.map((row) => {
    if (!row.imageUrl) return row;
    const key = fingerprintDedupeComposite(row.imageUrl);
    const generic = isLikelyGenericAsset(row.imageUrl);
    const count = generic
      ? (freqGeneric.get(key) ?? 0)
      : (freqArticle.get(key) ?? 0);
    const limit = generic ? thresholdGenericAssets : thresholdArticleImages;
    if (count < limit) return row;
    return { ...row, imageUrl: null };
  });
}
