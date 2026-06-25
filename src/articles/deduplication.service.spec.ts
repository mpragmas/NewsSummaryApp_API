import { DeduplicationService } from './deduplication.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { NormalizedArticle } from '../rss/rss.service';

function article(partial: Partial<NormalizedArticle>): NormalizedArticle {
  return {
    title: 'Title',
    content: 'Body content for the article.',
    imageUrl: null,
    url: 'https://example.com/a',
    source: 'BBC News',
    originalLanguage: 'en',
    publishedAt: new Date('2026-06-25T10:00:00Z'),
    continent: 'Global',
    region: 'Global',
    country: 'Global',
    ...partial,
  };
}

/** Prisma stub: nothing pre-exists in the DB. */
function makePrisma(existingUrls: string[] = []): PrismaService {
  return {
    article: {
      findMany: jest.fn(() =>
        Promise.resolve(existingUrls.map((url) => ({ url }))),
      ),
    },
  } as unknown as PrismaService;
}

describe('DeduplicationService', () => {
  it('keeps articles about the same event from DIFFERENT publishers', async () => {
    const svc = new DeduplicationService(makePrisma());
    const input = [
      article({
        source: 'BBC News',
        url: 'https://bbc.com/x',
        title: 'Ceasefire agreed in peace talks',
      }),
      article({
        source: 'France 24',
        url: 'https://france24.com/y',
        title: 'Ceasefire agreed in peace talks',
      }),
    ];

    const out = await svc.filterDuplicates(input);
    expect(out).toHaveLength(2);
    expect(out.map((a) => a.source).sort()).toEqual(['BBC News', 'France 24']);
  });

  it('drops a repeated identical URL within the batch', async () => {
    const svc = new DeduplicationService(makePrisma());
    const input = [
      article({ url: 'https://bbc.com/same', source: 'BBC News' }),
      article({ url: 'https://bbc.com/same', source: 'BBC News' }),
    ];
    const out = await svc.filterDuplicates(input);
    expect(out).toHaveLength(1);
  });

  it('drops a same-source exact-title repost (different URL)', async () => {
    const svc = new DeduplicationService(makePrisma());
    const input = [
      article({
        url: 'https://bbc.com/a1',
        source: 'BBC News',
        title: 'Same headline',
      }),
      article({
        url: 'https://bbc.com/a2',
        source: 'BBC News',
        title: 'Same headline',
      }),
    ];
    const out = await svc.filterDuplicates(input);
    expect(out).toHaveLength(1);
  });

  it('drops URLs that already exist in the database', async () => {
    const svc = new DeduplicationService(
      makePrisma(['https://bbc.com/existing']),
    );
    const input = [
      article({ url: 'https://bbc.com/existing' }),
      article({ url: 'https://bbc.com/fresh' }),
    ];
    const out = await svc.filterDuplicates(input);
    expect(out.map((a) => a.url)).toEqual(['https://bbc.com/fresh']);
  });
});
