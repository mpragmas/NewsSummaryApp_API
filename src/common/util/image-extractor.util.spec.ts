import { parseImageUrl } from './image-extractor.util';

describe('parseImageUrl — embedded/proxied image URLs', () => {
  it('unwraps a cropping-proxy prefix (Jeune Afrique) to the real CDN image', () => {
    const composite =
      'https://www.jeuneafrique.com/1806936/politique/x/gravity=0.58x0.22/' +
      'https://prod.cdn-medias.jeuneafrique.com/medias/2026/04/21/jad.jpg';
    expect(parseImageUrl(composite).url).toBe(
      'https://prod.cdn-medias.jeuneafrique.com/medias/2026/04/21/jad.jpg',
    );
  });

  it('unwraps a Next.js image-optimizer ?url= param', () => {
    const proxied =
      'https://example.com/_next/image?url=' +
      encodeURIComponent('https://cdn.site.com/photo.jpg') +
      '&w=640&q=75';
    expect(parseImageUrl(proxied).url).toBe('https://cdn.site.com/photo.jpg');
  });

  it('leaves a normal image URL untouched (no false unwrap)', () => {
    const normal =
      'https://www.aljazeera.com/wp-content/uploads/2026/06/img.jpg?resize=770';
    expect(parseImageUrl(normal).url).toBe(normal);
  });

  it('upgrades a protocol-relative URL to https', () => {
    expect(parseImageUrl('//images.bbc.co.uk/news/photo.jpg').url).toBe(
      'https://images.bbc.co.uk/news/photo.jpg',
    );
  });
});
