import type { SupportedLang } from '../../ai/prompts';

export interface LocationInfo {
  continent: string;
  region: string;
  country: string;
}

interface CountryRule extends LocationInfo {
  /** Whole-word keywords (diacritics folded, lowercased) that anchor this country. */
  keywords: string[];
}

/**
 * Country anchors used to (re)classify an article's geography from its text.
 *
 * Ordering matters only for ties — scoring decides the winner. Keywords are
 * matched on WHOLE-WORD boundaries (see {@link buildKeywordMatcher}); this is a
 * deliberate fix for the previous substring matcher, where the bare `rw`
 * keyword tagged unrelated English words ("fo<rw>ard", "d<rew>") as Rwanda.
 */
const COUNTRY_RULES: CountryRule[] = [
  {
    country: 'Rwanda',
    region: 'East Africa',
    continent: 'Africa',
    keywords: [
      'rwanda',
      'rwandan',
      'kigali',
      'kagame',
      'rwf',
      // Kinyarwanda phrasings
      'u rwanda',
      'mu rwanda',
      'rwanda',
      'abanyarwanda',
      'umunyarwanda',
      'rpf',
    ],
  },
  {
    country: 'Burundi',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['burundi', 'burundian', 'bujumbura', 'gitega', 'uburundi'],
  },
  {
    country: 'Uganda',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['uganda', 'ugandan', 'kampala', 'museveni'],
  },
  {
    country: 'Kenya',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['kenya', 'kenyan', 'nairobi', 'mombasa', 'ruto'],
  },
  {
    country: 'Tanzania',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['tanzania', 'tanzanian', 'dar es salaam', 'dodoma', 'zanzibar'],
  },
  {
    country: 'Ethiopia',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['ethiopia', 'ethiopian', 'addis ababa', 'abiy ahmed'],
  },
  {
    country: 'South Sudan',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['south sudan', 'juba'],
  },
  {
    country: 'Democratic Republic of the Congo',
    region: 'Central Africa',
    continent: 'Africa',
    keywords: [
      'drc',
      'dr congo',
      'drcongo',
      'congo',
      'kinshasa',
      'goma',
      'bukavu',
      'tshisekedi',
      'm23',
    ],
  },
];

const EAST_AFRICA_REGION = 'East Africa';

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Build a whole-word matcher for a keyword. Multi-word keywords ("dar es
 * salaam") are matched as a phrase. Boundaries use a non-letter/digit lookaround
 * so we don't get partial hits inside larger words.
 */
function matchesWord(text: string, keyword: string): boolean {
  const k = normalize(keyword).trim();
  if (!k) return false;
  // Escape regex metacharacters; collapse internal whitespace to \s+.
  const escaped = k
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  const re = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`,
    'u',
  );
  return re.test(text);
}

function countMatches(text: string, keyword: string): number {
  const k = normalize(keyword).trim();
  if (!k) return 0;
  const escaped = k
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}])`, 'gu');
  // Pad text so trailing matches at the very end are counted.
  const padded = ` ${text} `;
  return (padded.match(re) ?? []).length;
}

export interface InferLocationResult extends LocationInfo {
  /** Total weighted keyword score for the winning country (0 when defaults used). */
  score: number;
  /** True when the geography was upgraded from the supplied defaults by text. */
  inferred: boolean;
}

/**
 * Infer an article's geography from its title + content.
 *
 * Title hits weigh 3×, body hits 1×. A country only wins when its score clears a
 * confidence floor (≥ 2), which avoids a single passing mention re-homing a
 * global story. When nothing clears the floor the supplied `defaults` (from the
 * feed/scraper config) are kept verbatim.
 */
export function inferLocationDetailed(
  title: string,
  content: string,
  defaults: LocationInfo,
  _language: SupportedLang,
): InferLocationResult {
  const textTitle = normalize(title ?? '');
  const textBody = normalize(content ?? '');

  let best: { rule: CountryRule; score: number } | null = null;

  for (const rule of COUNTRY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (matchesWord(textTitle, keyword)) {
        score += 3;
      } else if (matchesWord(textBody, keyword)) {
        // Repeated body mentions strengthen the signal (cap so one rule can't run away).
        score += Math.min(countMatches(textBody, keyword), 3);
      }
    }
    if (!best || score > best.score) {
      best = { rule, score };
    }
  }

  if (!best || best.score < 2) {
    return { ...defaults, score: best?.score ?? 0, inferred: false };
  }

  return {
    continent: best.rule.continent,
    region: best.rule.region,
    country: best.rule.country,
    score: best.score,
    inferred: true,
  };
}

/** Backwards-compatible wrapper returning just the {continent, region, country}. */
export function inferLocationFromText(
  title: string,
  content: string,
  defaults: LocationInfo,
  language: SupportedLang,
): LocationInfo {
  const { continent, region, country } = inferLocationDetailed(
    title,
    content,
    defaults,
    language,
  );
  return { continent, region, country };
}

/** True when a region string denotes the East-Africa bloc (used by Explore filters). */
export function isEastAfricaRegion(region: string | null | undefined): boolean {
  return (
    (region ?? '').trim().toLowerCase() === EAST_AFRICA_REGION.toLowerCase()
  );
}
