import {
  emptyDropReport,
  mergeDropReports,
  formatDropReport,
} from './scrape-report';

describe('scrape drop report', () => {
  it('starts empty', () => {
    const r = emptyDropReport();
    expect(r.discovered).toBe(0);
    expect(r.inserted).toBe(0);
  });

  it('every discovered candidate is accounted for by a terminal bucket', () => {
    const r = emptyDropReport();
    r.discovered = 10;
    r.inserted = 5;
    r.fetchFailed = 2;
    r.rejectedInvalid = 1;
    r.rejectedLowQuality = 2;
    const accounted =
      r.inserted + r.fetchFailed + r.rejectedInvalid + r.rejectedLowQuality;
    expect(accounted).toBe(r.discovered);
  });

  it('merges multiple section reports additively', () => {
    const a = {
      ...emptyDropReport(),
      discovered: 3,
      inserted: 2,
      fetchFailed: 1,
    };
    const b = { ...emptyDropReport(), discovered: 4, inserted: 4 };
    const merged = mergeDropReports([a, b]);
    expect(merged.discovered).toBe(7);
    expect(merged.inserted).toBe(6);
    expect(merged.fetchFailed).toBe(1);
  });

  it('formats a human-readable line including drop reasons', () => {
    const r = {
      ...emptyDropReport(),
      discovered: 5,
      inserted: 4,
      rejectedLowQuality: 1,
    };
    const line = formatDropReport('Igihe', r);
    expect(line).toContain('discovered=5');
    expect(line).toContain('inserted=4');
    expect(line).toContain('lowQuality=1');
  });

  it('surfaces a listing failure (e.g. Cloudflare block)', () => {
    const r = { ...emptyDropReport(), listingFailed: 1 };
    expect(formatDropReport('Kigali Today', r)).toContain('listingFailed=1');
  });
});
