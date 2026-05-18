import type { SupportedLang } from '../../ai/prompts';

export interface LocationInfo {
  continent: string;
  region: string;
  country: string;
}

interface CountryRule extends LocationInfo {
  keywords: string[];
}

const COUNTRY_RULES: CountryRule[] = [
  {
    country: 'Rwanda',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['rwanda', 'kigali', 'u rwanda', 'mu rwanda', 'rw'],
  },
  {
    country: 'Burundi',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['burundi', 'bujumbura'],
  },
  {
    country: 'Uganda',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['uganda', 'kampala'],
  },
  {
    country: 'Kenya',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['kenya', 'nairobi'],
  },
  {
    country: 'Tanzania',
    region: 'East Africa',
    continent: 'Africa',
    keywords: ['tanzania', 'dar es salaam', 'dodoma'],
  },
  {
    country: 'Democratic Republic of the Congo',
    region: 'Central Africa',
    continent: 'Africa',
    keywords: ['drc', 'dr congo', 'congo', 'kinshasa', 'goma', 'bukavu'],
  },
];

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function inferLocationFromText(
  title: string,
  content: string,
  defaults: LocationInfo,
  _language: SupportedLang,
): LocationInfo {
  const textTitle = normalize(title ?? '');
  const textContent = normalize(content ?? '');
  const text = `${textTitle} ${textContent}`;

  let best: { rule: CountryRule; score: number } | null = null;

  for (const rule of COUNTRY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      const k = normalize(keyword);
      if (textTitle.includes(k)) score += 3;
      else if (text.includes(k)) score += 1;
    }

    if (!best || score > best.score) {
      best = { rule, score };
    }
  }

  if (!best || best.score < 2) return defaults;
  return {
    continent: best.rule.continent,
    region: best.rule.region,
    country: best.rule.country,
  };
}
