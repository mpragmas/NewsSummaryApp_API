/**
 * Per-ingest-cycle counters for tuning image rules (reset at start of each ingest).
 */

export interface DomainImageStats {
  normalizeAttempts: number;
  normalizeAccepted: number;
  picksSucceeded: number;
  picksNull: number;
}

export interface ImageIngestMetricsSnapshot {
  normalizeAccepted: number;
  normalizeRejected: number;
  rejectionsByRule: Record<string, number>;
  pickHadCandidates: number;
  pickChosen: number;
  pickNullNoCandidates: number;
  pickNullAfterScore: number;
  byDomain: Record<string, DomainImageStats>;
}

const emptyDomain = (): DomainImageStats => ({
  normalizeAttempts: 0,
  normalizeAccepted: 0,
  picksSucceeded: 0,
  picksNull: 0,
});

let snapshot: ImageIngestMetricsSnapshot = {
  normalizeAccepted: 0,
  normalizeRejected: 0,
  rejectionsByRule: {},
  pickHadCandidates: 0,
  pickChosen: 0,
  pickNullNoCandidates: 0,
  pickNullAfterScore: 0,
  byDomain: {},
};

export function resetImageIngestMetrics(): void {
  snapshot = {
    normalizeAccepted: 0,
    normalizeRejected: 0,
    rejectionsByRule: {},
    pickHadCandidates: 0,
    pickChosen: 0,
    pickNullNoCandidates: 0,
    pickNullAfterScore: 0,
    byDomain: {},
  };
}

function domainKey(url: string): string {
  try {
    return new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '(invalid)';
  }
}

export function recordUrlNormalization(
  url: string,
  accepted: boolean,
  rule?: string,
): void {
  const d = domainKey(url.startsWith('//') ? `https:${url}` : url);
  if (!snapshot.byDomain[d]) snapshot.byDomain[d] = emptyDomain();
  const row = snapshot.byDomain[d];
  row.normalizeAttempts++;
  if (accepted) {
    snapshot.normalizeAccepted++;
    row.normalizeAccepted++;
  } else {
    snapshot.normalizeRejected++;
    const r = rule ?? 'unknown';
    snapshot.rejectionsByRule[r] = (snapshot.rejectionsByRule[r] ?? 0) + 1;
  }
}

export function recordPickPhase(domainHint: string | undefined, phase: 'no_candidates' | 'chosen' | 'null_after_candidates'): void {
  const d =
    domainHint && domainHint.trim().length > 0 ? domainHint.trim() : '(unknown)';
  if (!snapshot.byDomain[d]) snapshot.byDomain[d] = emptyDomain();
  const row = snapshot.byDomain[d];

  if (phase === 'no_candidates') {
    snapshot.pickNullNoCandidates++;
    row.picksNull++;
  } else if (phase === 'chosen') {
    snapshot.pickChosen++;
    row.picksSucceeded++;
  } else {
    snapshot.pickHadCandidates++;
    snapshot.pickNullAfterScore++;
    row.picksNull++;
  }
}

export function formatImageIngestMetricsSummary(processedArticles: number): string {
  const lines: string[] = ['[image-metrics] ingest image summary'];
  const totalPicks = snapshot.pickChosen + snapshot.pickNullNoCandidates + snapshot.pickNullAfterScore;
  const nullPickRate =
    totalPicks > 0
      ? `${(((snapshot.pickNullNoCandidates + snapshot.pickNullAfterScore) / totalPicks) * 100).toFixed(1)}%`
      : 'n/a';
  lines.push(
    `  normalization: accepted=${snapshot.normalizeAccepted} rejected=${snapshot.normalizeRejected}`,
  );
  if (Object.keys(snapshot.rejectionsByRule).length > 0) {
    lines.push(
      `  rejection rules: ${Object.entries(snapshot.rejectionsByRule)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`,
    );
  }
  lines.push(
    `  picks: chosen=${snapshot.pickChosen} null_no_candidates=${snapshot.pickNullNoCandidates} null_after_pipeline=${snapshot.pickNullAfterScore} null_pick_rate=${nullPickRate}`,
  );
  if (processedArticles > 0) {
    const articleNullPct = ((snapshot.pickNullNoCandidates + snapshot.pickNullAfterScore) / processedArticles) * 100;
    lines.push(
      `  vs articles processed (${processedArticles}): approx articles without resolved hero=${articleNullPct.toFixed(1)}%`,
    );
  }

  const domains = Object.entries(snapshot.byDomain)
    .filter(([, v]) => v.normalizeAttempts > 0 || v.picksSucceeded + v.picksNull > 0)
    .sort((a, b) => b[1].normalizeAttempts - a[1].normalizeAttempts)
    .slice(0, 25);

  if (domains.length > 0) {
    lines.push('  top domains (normalize attempts / accepted / picks ok):');
    for (const [host, v] of domains) {
      const rate =
        v.normalizeAttempts > 0
          ? `${((v.normalizeAccepted / v.normalizeAttempts) * 100).toFixed(0)}%`
          : 'n/a';
      lines.push(
        `    ${host}: norm ${v.normalizeAccepted}/${v.normalizeAttempts} (${rate}), picks ok=${v.picksSucceeded}, null=${v.picksNull}`,
      );
    }
  }

  return lines.join('\n');
}

export function peekImageMetrics(): ImageIngestMetricsSnapshot {
  return {
    ...snapshot,
    rejectionsByRule: { ...snapshot.rejectionsByRule },
    byDomain: { ...snapshot.byDomain },
  };
}
