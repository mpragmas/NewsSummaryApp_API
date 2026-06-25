import { CategorizerService } from './categorizer.service';

describe('CategorizerService', () => {
  const svc = new CategorizerService();

  describe('English classification', () => {
    it('classifies politics', () => {
      expect(
        svc.categorize(
          'President meets parliament over new election law',
          'The government tabled legislation in the senate this week.',
          'en',
        ),
      ).toBe('Politics');
    });

    it('classifies business', () => {
      expect(
        svc.categorize(
          'Central bank raises interest rate as inflation climbs',
          'Investors reacted to the new GDP and currency figures.',
          'en',
        ),
      ).toBe('Business');
    });

    it('classifies technology', () => {
      expect(
        svc.categorize(
          'New artificial intelligence software ships to developers',
          'The startup says its algorithm runs in the cloud.',
          'en',
        ),
      ).toBe('Technology');
    });

    it('classifies sports', () => {
      expect(
        svc.categorize(
          'World Cup final ends in dramatic penalty shootout',
          'The football championship drew a record crowd.',
          'en',
        ),
      ).toBe('Sports');
    });

    it('classifies conflict', () => {
      expect(
        svc.categorize(
          'Airstrike hits city as ceasefire talks collapse',
          'Troops advanced and the military reported new casualties.',
          'en',
        ),
      ).toBe('Conflict');
    });

    it('classifies health', () => {
      expect(
        svc.categorize(
          'Health ministry launches cholera vaccine campaign',
          'Doctors at the hospital warned of a possible outbreak.',
          'en',
        ),
      ).toBe('Health');
    });
  });

  describe('Kinyarwanda classification', () => {
    it('classifies RW business (ubukungu/ubucuruzi)', () => {
      expect(
        svc.categorize(
          "Ubukungu bw'u Rwanda bwiyongereye ku isoko",
          "Ishoramari mu bucuruzi n'imisoro byazamutse.",
          'rw',
        ),
      ).toBe('Business');
    });

    it('classifies RW sports (imikino/umupira)', () => {
      expect(
        svc.categorize(
          "Imikino y'umupira w'amaguru yatangiye",
          'Umukinnyi yatsinze igitego cy intsinzi.',
          'rw',
        ),
      ).toBe('Sports');
    });

    it('classifies RW health (ubuzima/ibitaro)', () => {
      expect(
        svc.categorize(
          "Minisiteri y'ubuzima yatangije urukingo",
          'Abaganga bo mu bitaro baburiye ku ndwara.',
          'rw',
        ),
      ).toBe('Health');
    });
  });

  describe('false-positive guards (whole-word matching)', () => {
    it('does not match "war" inside "warrant"', () => {
      // No real conflict signal — substrings must not trigger a category.
      expect(
        svc.categorize(
          'Court issues an arrest warrant',
          'The judge signed the warrant on Tuesday afternoon downtown.',
          'en',
        ),
      ).not.toBe('Conflict');
    });

    it('does not match "app" inside "happen"', () => {
      const result = svc.categorize(
        'Nothing seemed to happen at the meeting',
        'It just happened that the chairs were rearranged in the hall.',
        'en',
      );
      expect(result).not.toBe('Technology');
    });
  });

  describe('General fallback + confidence', () => {
    it('returns General only when there is no taxonomy signal', () => {
      expect(
        svc.categorize(
          'Local residents gather for the weekend',
          'People came together near the square for the usual weekend stroll.',
          'en',
        ),
      ).toBe('General');
    });

    it('reports high confidence for a clearly single-topic article', () => {
      const res = svc.categorizeWithConfidence(
        'World Cup final: football championship decided on penalties',
        'The match and the tournament thrilled fans.',
        'en',
      );
      expect(res.category).toBe('Sports');
      expect(res.confidence).toBeGreaterThan(0.5);
    });

    it('reports zero confidence for General', () => {
      const res = svc.categorizeWithConfidence(
        'A quiet day',
        'Nothing notable.',
        'en',
      );
      expect(res.category).toBe('General');
      expect(res.confidence).toBe(0);
    });
  });
});
