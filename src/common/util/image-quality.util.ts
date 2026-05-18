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

const GENERIC_ASSET_PATH_RE =
  /\/(logo|favicon|icon|sprite|placeholder|avatar-default|brand-logo|site-logo)(\/|$)|\/icons?\//i;

/** Paths that are usually site chrome rather than story art — stricter dedupe. */
export function isLikelyGenericAsset(url: string): boolean {
  const p = parseImageUrl(url);
  if (!p.url) return true;
  try {
    const path = new URL(p.url).pathname;
    return GENERIC_ASSET_PATH_RE.test(path);
  } catch {
    return true;
  }
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
