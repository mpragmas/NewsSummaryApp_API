import {
  extractEntityKeys,
  normalizeTitleTokens,
  scoreSimilarity,
  SIMILARITY_THRESHOLD,
  type ArticleSignature,
  type ClusterTarget,
} from './text-signature.util';

describe('extractEntityKeys', () => {
  it('extracts proper-noun entities from a Kinyarwanda headline', () => {
    const keys = extractEntityKeys(
      'Perezida Kagame yasuye Intara y’Amajyaruguru',
      'Umukuru w’igihugu yagiranye ibiganiro n’abaturage.',
    );
    expect(keys).toEqual(expect.arrayContaining(['perezida kagame']));
  });

  it('falls back to salient long tokens when capitalization is absent', () => {
    // Scraped RW titles are sometimes all-lowercase — must still yield keys so
    // the article can be matched to a cluster via hasSome.
    const keys = extractEntityKeys(
      'umukino wumupira wamaguru waberanye iremezo',
      'inkuru irambuye ku mukino.',
    );
    expect(keys.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Kinyarwanda story clustering', () => {
  const base = {
    category: 'Sports',
    region: 'East Africa',
    country: 'Rwanda',
    language: 'rw',
  };

  function sig(title: string, content: string, when: Date): ArticleSignature {
    return {
      titleTokens: normalizeTitleTokens(title, 'rw'),
      entityKeys: extractEntityKeys(title, content),
      publishedAt: when,
      ...base,
    };
  }

  it('matches two RW outlets reporting the same event', () => {
    const t1 = new Date('2026-06-25T08:00:00Z');
    const t2 = new Date('2026-06-25T10:00:00Z');

    const a = sig(
      'Amavubi yatsinze Nigeria mu mukino wo gukira',
      'Ikipe y’u Rwanda Amavubi yatsinze Nigeria ibitego 2-1.',
      t1,
    );
    const clusterSeed = sig(
      'Amavubi yatsinze Nigeria, abakinnyi bishimye',
      'Amavubi y’u Rwanda yatsinze Nigeria mu irushanwa.',
      t2,
    );

    const target: ClusterTarget = {
      titleTokens: clusterSeed.titleTokens,
      entityKeys: clusterSeed.entityKeys,
      category: clusterSeed.category,
      region: clusterSeed.region,
      country: clusterSeed.country,
      latestPublishedAt: clusterSeed.publishedAt,
      language: clusterSeed.language,
    };

    expect(scoreSimilarity(a, target)).toBeGreaterThanOrEqual(
      SIMILARITY_THRESHOLD,
    );
  });

  it('does NOT merge unrelated RW stories', () => {
    const t = new Date('2026-06-25T08:00:00Z');
    const a = sig('Amavubi yatsinze Nigeria', 'umukino w’umupira.', t);
    const other = sig(
      'Minisitiri yatangije gahunda y’ubuzima',
      'gahunda nshya yo kurwanya indwara.',
      t,
    );
    const target: ClusterTarget = {
      titleTokens: other.titleTokens,
      entityKeys: other.entityKeys,
      category: 'Health',
      region: other.region,
      country: other.country,
      latestPublishedAt: other.publishedAt,
      language: other.language,
    };
    expect(scoreSimilarity(a, target)).toBeLessThan(SIMILARITY_THRESHOLD);
  });

  it('never merges across languages', () => {
    const t = new Date('2026-06-25T08:00:00Z');
    const rw = sig('Amavubi yatsinze Nigeria', 'umukino.', t);
    const enTarget: ClusterTarget = {
      titleTokens: normalizeTitleTokens(
        'Amavubi beat Nigeria in friendly',
        'en',
      ),
      entityKeys: extractEntityKeys('Amavubi beat Nigeria', 'match report'),
      category: 'Sports',
      region: 'East Africa',
      country: 'Rwanda',
      latestPublishedAt: t,
      language: 'en',
    };
    expect(scoreSimilarity(rw, enTarget)).toBe(0);
  });
});
