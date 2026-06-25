import {
  inferLocationFromText,
  inferLocationDetailed,
  isEastAfricaRegion,
} from './location-inference.util';

const GLOBAL = { continent: 'Global', region: 'Global', country: 'Global' };

describe('inferLocationFromText', () => {
  describe('Rwanda', () => {
    it('classifies a Kigali story as Rwanda / East Africa / Africa', () => {
      const loc = inferLocationFromText(
        'Kigali hosts regional investment summit',
        'Officials from across the region met in the Rwandan capital.',
        GLOBAL,
        'en',
      );
      expect(loc).toEqual({
        continent: 'Africa',
        region: 'East Africa',
        country: 'Rwanda',
      });
    });

    it('classifies Kinyarwanda text mentioning u Rwanda', () => {
      const loc = inferLocationFromText(
        'Abanyarwanda bishimiye iterambere',
        "Mu Rwanda hateganyijwe gahunda nshya y'iterambere.",
        GLOBAL,
        'rw',
      );
      expect(loc.country).toBe('Rwanda');
      expect(loc.region).toBe('East Africa');
    });
  });

  describe('East Africa neighbours', () => {
    it('classifies Burundi', () => {
      const loc = inferLocationFromText(
        'Bujumbura markets reopen',
        'Burundi traders returned.',
        GLOBAL,
        'en',
      );
      expect(loc.country).toBe('Burundi');
      expect(loc.region).toBe('East Africa');
    });

    it('classifies Kenya', () => {
      const loc = inferLocationFromText(
        'Nairobi traffic plan unveiled',
        'Kenya officials spoke.',
        GLOBAL,
        'en',
      );
      expect(loc.country).toBe('Kenya');
      expect(loc.region).toBe('East Africa');
    });

    it('classifies DR Congo into Central Africa', () => {
      const loc = inferLocationFromText(
        'Goma residents flee',
        'Fighting near Kinshasa and the DRC border.',
        GLOBAL,
        'en',
      );
      expect(loc.country).toBe('Democratic Republic of the Congo');
      expect(loc.region).toBe('Central Africa');
    });
  });

  describe('Global stays Global (no false upgrade)', () => {
    it('keeps an unrelated US story Global', () => {
      const loc = inferLocationFromText(
        'US Federal Reserve raises interest rates',
        'Markets across the world reacted to the decision.',
        GLOBAL,
        'en',
      );
      expect(loc).toEqual(GLOBAL);
    });

    // Regression: the previous substring matcher tagged "forward"/"drew" as Rwanda via the bare "rw" keyword.
    it('does NOT tag "forward" / "drew" as Rwanda', () => {
      const res = inferLocationDetailed(
        'Team pushes forward as crowd drew near',
        'They moved forward; the screws were tight and the crew worked.',
        GLOBAL,
        'en',
      );
      expect(res.country).toBe('Global');
      expect(res.inferred).toBe(false);
    });
  });

  describe('isEastAfricaRegion', () => {
    it('recognises the East Africa bloc', () => {
      expect(isEastAfricaRegion('East Africa')).toBe(true);
      expect(isEastAfricaRegion('east africa')).toBe(true);
      expect(isEastAfricaRegion('Global')).toBe(false);
      expect(isEastAfricaRegion(null)).toBe(false);
    });
  });
});
