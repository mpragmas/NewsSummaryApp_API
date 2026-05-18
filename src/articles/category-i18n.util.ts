export type SupportedCategoryLang = 'en' | 'fr' | 'rw';

export const CANONICAL_CATEGORIES = [
  'Politics',
  'Business',
  'Technology',
  'Health',
  'Sports',
  'Entertainment',
  'Science',
  'Conflict',
  'General',
] as const;

export type CanonicalCategory = (typeof CANONICAL_CATEGORIES)[number];

const CATEGORY_LABELS: Record<
  CanonicalCategory,
  Record<SupportedCategoryLang, string>
> = {
  Politics: { en: 'Politics', fr: 'Politique', rw: 'Politiki' },
  Business: { en: 'Business', fr: 'Affaires', rw: 'Ubucuruzi' },
  Technology: { en: 'Technology', fr: 'Technologie', rw: 'Ikoranabuhanga' },
  Health: { en: 'Health', fr: 'Sante', rw: 'Ubuzima' },
  Sports: { en: 'Sports', fr: 'Sports', rw: 'Imikino' },
  Entertainment: { en: 'Entertainment', fr: 'Divertissement', rw: 'Imyidagaduro' },
  Science: { en: 'Science', fr: 'Science', rw: 'Ubumenyi' },
  Conflict: { en: 'Conflict', fr: 'Conflit', rw: 'Amakimbirane' },
  General: { en: 'General', fr: 'General', rw: 'Rusange' },
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function localizeCategory(
  category: string | null | undefined,
  lang?: SupportedCategoryLang,
): string | null {
  if (!category) return null;
  const canonical = normalizeCategoryInput(category) as CanonicalCategory;
  if (!canonical) return category;
  const target = lang ?? 'en';
  return CATEGORY_LABELS[canonical][target];
}

export function normalizeCategoryInput(
  value: string | null | undefined,
): CanonicalCategory | null {
  if (!value) return null;
  const n = normalize(value);

  for (const category of CANONICAL_CATEGORIES) {
    const labels = CATEGORY_LABELS[category];
    if (
      normalize(category) === n ||
      normalize(labels.en) === n ||
      normalize(labels.fr) === n ||
      normalize(labels.rw) === n
    ) {
      return category;
    }
  }

  return null;
}
