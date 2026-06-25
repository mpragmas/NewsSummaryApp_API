/**
 * Deterministic, language-aware text signatures for story clustering.
 *
 * No AI / embeddings — everything here is pure, fast and unit-testable so it
 * can run synchronously inside the (background) clustering worker without
 * violating the "never call AI synchronously" rule in CLAUDE.md.
 *
 * The signal combines:
 *   - normalized title tokens (stopwords stripped, diacritics folded)
 *   - named-entity keys (proper-noun / multiword / number heuristics)
 *   - publish-time proximity
 *   - category + region/country agreement
 */

export type ClusterLang = 'en' | 'fr' | 'rw';

export interface ArticleSignature {
  titleTokens: string[];
  entityKeys: string[];
  category: string | null;
  region: string | null;
  country: string | null;
  publishedAt: Date;
  language: string;
}

// Stopwords kept intentionally compact — just enough to stop common glue words
// from dominating the token Jaccard. Diacritics are folded before comparison.
const STOPWORDS: Record<ClusterLang, ReadonlySet<string>> = {
  en: new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'of',
    'to',
    'in',
    'on',
    'for',
    'with',
    'at',
    'by',
    'from',
    'as',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'it',
    'its',
    'this',
    'that',
    'these',
    'those',
    'his',
    'her',
    'their',
    'our',
    'has',
    'have',
    'had',
    'will',
    'would',
    'can',
    'could',
    'after',
    'over',
    'into',
    'about',
    'amid',
    'says',
    'say',
    'said',
    'new',
    'up',
    'out',
    'who',
    'how',
    'why',
    'what',
    'when',
    'where',
  ]),
  fr: new Set([
    'le',
    'la',
    'les',
    'un',
    'une',
    'des',
    'de',
    'du',
    'et',
    'ou',
    'mais',
    'a',
    'à',
    'au',
    'aux',
    'en',
    'dans',
    'pour',
    'par',
    'sur',
    'avec',
    'sans',
    'que',
    'qui',
    'quoi',
    'dont',
    'ce',
    'cet',
    'cette',
    'ces',
    'son',
    'sa',
    'ses',
    'leur',
    'leurs',
    'est',
    'sont',
    'été',
    'être',
    'plus',
    'après',
    'selon',
    'contre',
    'vers',
    'dit',
    'dire',
    'nouveau',
    'nouvelle',
  ]),
  rw: new Set([
    'na',
    'mu',
    'ku',
    'ya',
    'wa',
    'ba',
    'bya',
    'cya',
    'rya',
    'rwa',
    'kwa',
    'iyo',
    'uyu',
    'aba',
    'ibi',
    'icyo',
    'cyangwa',
    'ariko',
    'kandi',
    'nka',
    'ni',
    'si',
    'yo',
    'we',
    'bo',
    'ko',
    'kuri',
    'mbere',
    'nyuma',
  ]),
};

/** Fold accents and lowercase for language-agnostic comparison. */
function foldDiacritics(input: string): string {
  return input.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function toClusterLang(language: string): ClusterLang {
  if (language === 'fr' || language === 'rw') return language;
  return 'en';
}

/**
 * Lowercased, accent-folded, stopword-stripped title tokens (length ≥ 3).
 * Used for the title-token Jaccard component of the score.
 */
export function normalizeTitleTokens(
  title: string,
  language: string,
): string[] {
  const lang = toClusterLang(language);
  const stop = STOPWORDS[lang];
  const folded = foldDiacritics(title ?? '');
  const raw = folded
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const tok of raw) {
    if (tok.length < 3) continue;
    if (stop.has(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    tokens.push(tok);
  }
  return tokens;
}

/**
 * Heuristic named-entity / salient-term extraction. Language-agnostic on
 * purpose: proper nouns (Kagame, Rwanda, UN), capitalized multiword runs
 * (United Nations), 4-digit years, and standalone numbers are strong
 * same-event signals even across phrasing differences.
 *
 * Returns accent-folded lowercase keys so they can be stored in
 * `StoryCluster.entityKeys` and matched with Prisma `hasSome`.
 */
export function extractEntityKeys(title: string, content: string): string[] {
  const keys = new Set<string>();
  const text = `${title ?? ''} . ${(content ?? '').slice(0, 600)}`;

  // Capitalized runs: "United Nations", "Paul Kagame" → "united nations", ...
  const capRun = /\b([A-Z][\p{L}]+(?:\s+[A-Z][\p{L}]+){0,3})\b/gu;
  let m: RegExpExecArray | null;
  while ((m = capRun.exec(text)) !== null) {
    const phrase = foldDiacritics(m[1]).trim();
    // Drop single short capitalized words that are likely sentence starters.
    if (phrase.includes(' ') || phrase.length >= 5) {
      keys.add(phrase);
    }
  }

  // Years and standalone numbers (counts, scores) from the title — very stable.
  const numbers = (title ?? '').match(/\b\d{2,4}\b/g) ?? [];
  for (const n of numbers) keys.add(n);

  // Fallback for headlines with little/inconsistent capitalization (common in
  // scraped Kinyarwanda titles): seed entity keys from the longest salient title
  // tokens so the article can still be matched to a cluster by `hasSome`.
  if (keys.size < 2) {
    const salient = foldDiacritics(title ?? '')
      .replace(/['’`]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 6)
      .sort((a, b) => b.length - a.length)
      .slice(0, 4);
    for (const t of salient) keys.add(t);
  }

  // Cap to the most informative keys to keep arrays small + indexes fast.
  return Array.from(keys).slice(0, 24);
}

/**
 * Salient body tokens from the first ~1000 chars: stopword-stripped, length ≥ 4,
 * ranked by frequency then length. Folding content into the lexical signature
 * (alongside the title) means two outlets that phrase a headline differently but
 * share the same body vocabulary still match — "title + content + entities"
 * instead of title-only.
 */
export function extractContentTokens(
  content: string,
  language: string,
  cap = 12,
): string[] {
  const lang = toClusterLang(language);
  const stop = STOPWORDS[lang];
  const folded = foldDiacritics((content ?? '').slice(0, 1000));
  const raw = folded
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const freq = new Map<string, number>();
  for (const tok of raw) {
    if (tok.length < 4) continue;
    if (stop.has(tok)) continue;
    freq.set(tok, (freq.get(tok) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, cap)
    .map(([t]) => t);
}

/**
 * Lexical signature = title tokens + top salient content tokens (deduped).
 * Stored in `StoryCluster.titleTokens`; the display headline lives in
 * `canonicalTitle`, so widening this set does not affect what users see.
 */
export function buildLexicalTokens(
  title: string,
  content: string,
  language: string,
): string[] {
  return Array.from(
    new Set([
      ...normalizeTitleTokens(title, language),
      ...extractContentTokens(content, language),
    ]),
  );
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  let inter = 0;
  for (const x of new Set(a)) if (setB.has(x)) inter++;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function overlapRatio(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  let inter = 0;
  for (const x of new Set(a)) if (setB.has(x)) inter++;
  return inter / Math.min(new Set(a).size, setB.size);
}

/** Number of entity keys shared by both signatures. */
function sharedCount(a: string[], b: string[]): number {
  const setB = new Set(b);
  let n = 0;
  for (const x of new Set(a)) if (setB.has(x)) n++;
  return n;
}

export interface ClusterTarget {
  titleTokens: string[];
  entityKeys: string[];
  category: string | null;
  region: string | null;
  country: string | null;
  latestPublishedAt: Date;
  language: string;
}

export const SIMILARITY_THRESHOLD = 0.62;

/** Hours beyond which two items are very unlikely to be the same fresh story. */
export const TIME_WINDOW_HOURS = 48;

/**
 * Weighted 0..1 similarity between an incoming article and an existing cluster.
 *
 * Cross-language aware: an EN/FR/RW article about the same event groups with the
 * cluster when they share enough *named entities* (proper nouns / numbers, which
 * survive translation), since title/content tokens themselves do not translate.
 * Cross-language matches require stricter, more specific agreement to avoid
 * merging unrelated stories that merely share a common name.
 */
export function scoreSimilarity(
  article: ArticleSignature,
  cluster: ClusterTarget,
): number {
  const sameLang =
    toClusterLang(article.language) === toClusterLang(cluster.language);

  const entityOverlap = overlapRatio(article.entityKeys, cluster.entityKeys);
  const sharedEntities = sharedCount(article.entityKeys, cluster.entityKeys);

  // Time proximity: linear decay from 1 (same time) to 0 at the window edge.
  const hoursApart =
    Math.abs(
      article.publishedAt.getTime() - cluster.latestPublishedAt.getTime(),
    ) / 3_600_000;
  const timeProximity = Math.max(0, 1 - hoursApart / TIME_WINDOW_HOURS);

  const categoryMatch =
    article.category && cluster.category
      ? article.category === cluster.category
        ? 1
        : 0
      : 0.5; // unknown category → neutral, don't penalize

  const regionMatch =
    (article.country &&
      cluster.country &&
      article.country === cluster.country) ||
    (article.region && cluster.region && article.region === cluster.region)
      ? 1
      : 0;

  // ── Cross-language path: entities carry the whole lexical load ─────────────
  if (!sameLang) {
    // Require multiple shared entities + solid overlap + same time window +
    // agreeing region or category. A single shared common name (e.g. "Rwanda")
    // is never enough to merge two different stories across languages.
    const strongAgreement =
      sharedEntities >= 2 &&
      entityOverlap >= 0.5 &&
      timeProximity > 0 &&
      (regionMatch === 1 || categoryMatch === 1);
    if (!strongAgreement) return 0;

    const score =
      0.6 * entityOverlap +
      0.22 * timeProximity +
      0.1 * categoryMatch +
      0.08 * regionMatch;
    return Math.max(score, SIMILARITY_THRESHOLD);
  }

  // ── Same-language path: lexical (title+content) + entity signals ───────────
  const titleJaccard = jaccard(article.titleTokens, cluster.titleTokens);

  // Weights: lexical + entity signals dominate; time/category/region refine.
  const score =
    0.42 * titleJaccard +
    0.3 * entityOverlap +
    0.14 * timeProximity +
    0.08 * categoryMatch +
    0.06 * regionMatch;

  // Strong-entity shortcut: if entities overlap heavily AND titles share some
  // tokens within the window, treat as same story even if Jaccard is modest
  // (different outlets phrase headlines very differently).
  if (entityOverlap >= 0.6 && titleJaccard >= 0.2 && timeProximity > 0) {
    return Math.max(score, SIMILARITY_THRESHOLD);
  }

  return score;
}
