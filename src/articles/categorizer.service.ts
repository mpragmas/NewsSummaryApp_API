import { Injectable } from '@nestjs/common';
import { SupportedLang } from '../ai/prompts';
import { CanonicalCategory } from './category-i18n.util';

/**
 * Keyword taxonomy. `strong` terms are high-signal (a single title hit is
 * usually decisive); `weak` terms only nudge the score so generic words don't
 * dominate. Terms are matched on WHOLE-WORD boundaries after diacritic folding,
 * which removes the previous false positives (e.g. "app" inside "happen", or
 * "war" inside "warrant").
 */
interface CategoryLexicon {
  strong: string[];
  weak: string[];
}

const CATEGORY_KEYWORDS: Record<
  Exclude<CanonicalCategory, 'General'>,
  CategoryLexicon
> = {
  Politics: {
    strong: [
      'election',
      'elections',
      'parliament',
      'senate',
      'congress',
      'minister',
      'president',
      'government',
      'diplomat',
      'diplomacy',
      'sanctions',
      'coup',
      'legislation',
      'referendum',
      'cabinet',
      'governor',
      'lawmaker',
      'élection',
      'gouvernement',
      'président',
      'ministre',
      'parlement',
      'sénat',
      'démocratie',
      'diplomate',
      'référendum',
      'amatora',
      'guverinoma',
      'minisitiri',
      'inteko',
      'perezida',
      'leta',
      'umukuru w igihugu',
      'politiki',
    ],
    weak: [
      'political',
      'vote',
      'voter',
      'democracy',
      'policy',
      'treaty',
      'reform',
      'campaign',
      'ballot',
      'politique',
      'loi',
      'traité',
      'réforme',
      'itegeko',
      'dipolomasi',
      'amajwi',
    ],
  },
  Business: {
    strong: [
      'economy',
      'inflation',
      'gdp',
      'stock',
      'stocks',
      'shares',
      'investment',
      'investor',
      'startup',
      'merger',
      'acquisition',
      'ipo',
      'revenue',
      'currency',
      'central bank',
      'interest rate',
      'trade deal',
      'tariff',
      'économie',
      'inflation',
      'bourse',
      'investissement',
      'fusion',
      'chiffre d affaires',
      'banque centrale',
      'ubukungu',
      'ubucuruzi',
      'ishoramari',
      'isoko',
      'imisoro',
      'ifaranga',
      'banki',
      'inyungu',
      'igihombo',
      'uruganda',
    ],
    weak: [
      'market',
      'trade',
      'bank',
      'financial',
      'finance',
      'fund',
      'corporate',
      'industry',
      'profit',
      'export',
      'import',
      'marché',
      'commerce',
      'banque',
      'financier',
      'fonds',
      'entreprise',
      'industrie',
      'bénéfice',
    ],
  },
  Technology: {
    strong: [
      'artificial intelligence',
      'machine learning',
      'software',
      'cybersecurity',
      'blockchain',
      'cryptocurrency',
      'smartphone',
      'semiconductor',
      'algorithm',
      'data center',
      'startup',
      'gadget',
      'app',
      'chatbot',
      'intelligence artificielle',
      'logiciel',
      'cybersécurité',
      'algorithme',
      'ikoranabuhanga',
      'mudasobwa',
      'interineti',
      'porogaramu',
      'ubwenge bw ubukorano',
    ],
    weak: [
      'tech',
      'ai',
      'hardware',
      'cloud',
      'digital',
      'internet',
      'robot',
      'automation',
      'crypto',
      'innovation',
      'technologie',
      'numérique',
      'matériel',
      'données',
      'automatisation',
    ],
  },
  Health: {
    strong: [
      'hospital',
      'disease',
      'vaccine',
      'pandemic',
      'outbreak',
      'epidemic',
      'surgery',
      'cancer',
      'malaria',
      'cholera',
      'ebola',
      'covid',
      'hiv',
      'mental health',
      'clinical',
      'medicine',
      'who',
      'hôpital',
      'maladie',
      'vaccin',
      'pandémie',
      'épidémie',
      'chirurgie',
      'médicament',
      'santé mentale',
      'ubuzima',
      'ibitaro',
      'indwara',
      'urukingo',
      'umuganga',
      'ubuvuzi',
      'imiti',
      'icyorezo',
      'malariya',
    ],
    weak: [
      'health',
      'doctor',
      'medical',
      'drug',
      'nutrition',
      'patient',
      'santé',
      'médecin',
      'médical',
      'imirire',
    ],
  },
  Sports: {
    strong: [
      'football',
      'soccer',
      'basketball',
      'cricket',
      'tennis',
      'olympics',
      'world cup',
      'championship',
      'tournament',
      'fifa',
      'nba',
      'premier league',
      'rugby',
      'marathon',
      'afcon',
      'amavubi',
      'jeux olympiques',
      'coupe du monde',
      'championnat',
      'tournoi',
      'imikino',
      'umupira',
      'irushanwa',
      'umukinnyi',
      'igitego',
      'intsinzi',
    ],
    weak: [
      'league',
      'athlete',
      'coach',
      'match',
      'sport',
      'score',
      'goal',
      'team',
      'ligue',
      'athlète',
      'entraîneur',
      'but',
      'équipe',
      'itsinda',
    ],
  },
  Entertainment: {
    strong: [
      'movie',
      'film',
      'concert',
      'album',
      'celebrity',
      'oscar',
      'grammy',
      'netflix',
      'box office',
      'festival',
      'singer',
      'actor',
      'actress',
      'fashion',
      'theatre',
      'comedy',
      'musique',
      'célébrité',
      'acteur',
      'actrice',
      'théâtre',
      'comédie',
      'imyidagaduro',
      'umuziki',
      'filime',
      'umuhanzi',
      'abahanzi',
      'igitaramo',
      'ikinamico',
    ],
    weak: [
      'music',
      'award',
      'streaming',
      'culture',
      'art',
      'show',
      'prix',
      'mode',
      'umuco',
      'imyambarire',
    ],
  },
  Science: {
    strong: [
      'research',
      'study',
      'nasa',
      'space',
      'satellite',
      'climate change',
      'discovery',
      'experiment',
      'physics',
      'biology',
      'chemistry',
      'genome',
      'telescope',
      'fossil',
      'dna',
      'spacecraft',
      'recherche',
      'étude',
      'découverte',
      'expérience',
      'télescope',
      'ubumenyi',
      'ubushakashatsi',
      'isanzure',
      'ivumburwa',
    ],
    weak: [
      'science',
      'climate',
      'environment',
      'species',
      'planet',
      'gene',
      'universe',
      'climat',
      'environnement',
      'espèce',
      'planète',
      'ikirere',
      'ibidukikije',
    ],
  },
  Conflict: {
    strong: [
      'war',
      'conflict',
      'military',
      'army',
      'troops',
      'airstrike',
      'bombing',
      'missile',
      'ceasefire',
      'insurgent',
      'terrorism',
      'terrorist',
      'hostage',
      'genocide',
      'rebels',
      'offensive',
      'militia',
      'nato',
      'guerre',
      'conflit',
      'militaire',
      'armée',
      'bombardement',
      'cessez-le-feu',
      'terrorisme',
      'otage',
      'intambara',
      'amakimbirane',
      'igisirikare',
      'igitero',
      'ibisasu',
      'iterabwoba',
      'impunzi',
    ],
    weak: [
      'battle',
      'attack',
      'weapon',
      'peace',
      'refugee',
      'soldier',
      'clash',
      'bataille',
      'attaque',
      'arme',
      'paix',
      'réfugié',
      'soldat',
      'amahoro',
    ],
  },
};

interface CompiledTerm {
  category: Exclude<CanonicalCategory, 'General'>;
  weight: number;
  regex: RegExp;
}

const STRONG_WEIGHT = 3;
const WEAK_WEIGHT = 1;
const TITLE_MULTIPLIER = 3;

/** Minimum absolute score before we trust a category over "General". */
const MIN_SCORE_FOR_CATEGORY = 2;

function foldDiacritics(value: string): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function compileTerm(
  category: Exclude<CanonicalCategory, 'General'>,
  term: string,
  weight: number,
): CompiledTerm {
  const folded = foldDiacritics(term);
  const escaped = folded
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  // Whole-word / phrase boundary so substrings inside longer words don't match.
  const regex = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`,
    'u',
  );
  return { category, weight, regex };
}

const COMPILED_TERMS: CompiledTerm[] = (() => {
  const out: CompiledTerm[] = [];
  for (const [category, lexicon] of Object.entries(CATEGORY_KEYWORDS)) {
    const cat = category as Exclude<CanonicalCategory, 'General'>;
    for (const term of lexicon.strong)
      out.push(compileTerm(cat, term, STRONG_WEIGHT));
    for (const term of lexicon.weak)
      out.push(compileTerm(cat, term, WEAK_WEIGHT));
  }
  return out;
})();

export interface CategoryScore {
  category: CanonicalCategory;
  confidence: number;
  scores: Record<string, number>;
}

@Injectable()
export class CategorizerService {
  /**
   * Classify an article into a canonical category.
   *
   * Returns `General` ONLY when no taxonomy signal is found (truly unknown).
   */
  categorize(
    title: string,
    content: string,
    language: SupportedLang = 'en',
  ): CanonicalCategory {
    return this.categorizeWithConfidence(title, content, language).category;
  }

  /**
   * Like {@link categorize} but also returns a confidence in [0,1] and the raw
   * per-category scores. Confidence blends the winner's share of total signal
   * with its margin over the runner-up, so a clear single-topic article scores
   * high and an ambiguous one scores low (useful for fallback decisions).
   */
  categorizeWithConfidence(
    title: string,
    content: string,
    _language: SupportedLang = 'en',
  ): CategoryScore {
    const titleText = foldDiacritics(title ?? '');
    const bodyText = foldDiacritics(content ?? '');

    const scores: Record<string, number> = {};
    for (const term of COMPILED_TERMS) {
      if (term.regex.test(titleText)) {
        scores[term.category] =
          (scores[term.category] ?? 0) + term.weight * TITLE_MULTIPLIER;
      } else if (term.regex.test(bodyText)) {
        scores[term.category] = (scores[term.category] ?? 0) + term.weight;
      }
    }

    const ranked = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const top = ranked[0];

    if (!top || top[1] < MIN_SCORE_FOR_CATEGORY) {
      return { category: 'General', confidence: 0, scores };
    }

    const total = ranked.reduce((acc, [, s]) => acc + s, 0);
    const second = ranked[1]?.[1] ?? 0;
    const share = total > 0 ? top[1] / total : 0;
    const margin = top[1] > 0 ? (top[1] - second) / top[1] : 0;
    // Weighted blend: dominant share AND clear margin → high confidence.
    const confidence = Math.min(1, 0.6 * share + 0.4 * margin);

    return {
      category: top[0] as CanonicalCategory,
      confidence: Number(confidence.toFixed(3)),
      scores,
    };
  }
}
