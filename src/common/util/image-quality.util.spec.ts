import {
  isLikelyGenericAsset,
  dropOverusedImages,
  sanitizeImageUrl,
} from './image-quality.util';

describe('isLikelyGenericAsset', () => {
  it('keeps a real Igihe article photo stored under /IMG/logo/ (SPIP lead image)', () => {
    // Regression: "logo" here is the CMS term for the article thumbnail, not chrome.
    expect(
      isLikelyGenericAsset('https://igihe.com/IMG/logo/condor.jpg?1782370083'),
    ).toBe(false);
  });

  it('keeps a normal CMS media photo', () => {
    expect(
      isLikelyGenericAsset('https://www.kigalitoday.com/IMG/arton12345.jpg'),
    ).toBe(false);
    expect(
      isLikelyGenericAsset('https://site.com/img/2026/story-photo.jpg'),
    ).toBe(false);
  });

  it('rejects an actual brand logo file', () => {
    expect(isLikelyGenericAsset('https://site.com/assets/logo.png')).toBe(true);
    expect(
      isLikelyGenericAsset('https://site.com/static/site-logo/header.png'),
    ).toBe(true);
  });

  it('rejects placeholders and icon sets', () => {
    expect(
      isLikelyGenericAsset('https://site.com/images/placeholder.jpg'),
    ).toBe(true);
    expect(isLikelyGenericAsset('https://cdn.site.com/icons/share.png')).toBe(
      true,
    );
  });
});

describe('dropOverusedImages', () => {
  it('nulls an over-repeated generic asset but keeps a moderately reused article photo', () => {
    const rows = [
      ...Array.from({ length: 8 }, () => ({
        id: 'g',
        imageUrl: 'https://site.com/assets/logo.png',
      })),
      ...Array.from({ length: 3 }, () => ({
        id: 'a',
        imageUrl: 'https://igihe.com/IMG/logo/realphoto.jpg',
      })),
    ];

    const out = dropOverusedImages(rows);
    const generic = out.filter((r) => r.id === 'g');
    const article = out.filter((r) => r.id === 'a');

    expect(generic.every((r) => r.imageUrl === null)).toBe(true);
    expect(article.every((r) => r.imageUrl !== null)).toBe(true);
  });
});

describe('sanitizeImageUrl', () => {
  it('strips tracking params and rejects svg/placeholder', () => {
    expect(
      sanitizeImageUrl('https://site.com/img/p.jpg?utm_source=rss&w=600'),
    ).toContain('https://site.com/img/p.jpg');
    expect(sanitizeImageUrl('https://site.com/icon.svg')).toBeNull();
    expect(sanitizeImageUrl(null)).toBeNull();
  });
});
