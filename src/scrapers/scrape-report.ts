/**
 * Structured accounting of where scraped articles go between discovery and
 * insertion. Surfaced in logs so "articles are being lost" can be diagnosed at a
 * glance: every discovered candidate is accounted for by exactly one terminal
 * bucket (inserted, skipped*, fetchFailed, rejected*).
 */
export interface ScrapeDropReport {
  /** Listing pages that could not be fetched at all (Cloudflare/offline). */
  listingFailed: number;
  /** Unique article candidates found in the listing(s). */
  discovered: number;
  /** Candidate links that were not article URLs (nav/category/external). */
  skippedNonArticle: number;
  /** Duplicate URLs within the same listing pass. */
  skippedDuplicate: number;
  /** Detail page could not be fetched / had no usable title. */
  fetchFailed: number;
  /** Failed the structural validity gate (too short, bad title/url/date). */
  rejectedInvalid: number;
  /** Failed a content-quality gate (repeated words, nav text, not journalistic). */
  rejectedLowQuality: number;
  /** Accepted and returned to the ingestion pipeline. */
  inserted: number;
}

export function emptyDropReport(): ScrapeDropReport {
  return {
    listingFailed: 0,
    discovered: 0,
    skippedNonArticle: 0,
    skippedDuplicate: 0,
    fetchFailed: 0,
    rejectedInvalid: 0,
    rejectedLowQuality: 0,
    inserted: 0,
  };
}

export function mergeDropReports(
  reports: ScrapeDropReport[],
): ScrapeDropReport {
  return reports.reduce<ScrapeDropReport>((acc, r) => {
    acc.listingFailed += r.listingFailed;
    acc.discovered += r.discovered;
    acc.skippedNonArticle += r.skippedNonArticle;
    acc.skippedDuplicate += r.skippedDuplicate;
    acc.fetchFailed += r.fetchFailed;
    acc.rejectedInvalid += r.rejectedInvalid;
    acc.rejectedLowQuality += r.rejectedLowQuality;
    acc.inserted += r.inserted;
    return acc;
  }, emptyDropReport());
}

export function formatDropReport(label: string, r: ScrapeDropReport): string {
  return (
    `[${label}] discovered=${r.discovered} inserted=${r.inserted} ` +
    `| dropped: nonArticle=${r.skippedNonArticle} dup=${r.skippedDuplicate} ` +
    `fetchFail=${r.fetchFailed} invalid=${r.rejectedInvalid} lowQuality=${r.rejectedLowQuality}` +
    (r.listingFailed ? ` listingFailed=${r.listingFailed}` : '')
  );
}
