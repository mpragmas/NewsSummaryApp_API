/**
 * Tight, token-frugal prompts. Content is hard-clipped to {@link CONTENT_CHAR_LIMIT}
 * (~300 tokens) — Groq free tier is TPM-bound, so prompt size dominates cost.
 */
export type SupportedLang = 'en' | 'fr' | 'rw';

export const CONTENT_CHAR_LIMIT = 1_200;
export const MAX_OUTPUT_TOKENS = 220;

export function buildPrompt(
  title: string,
  content: string,
  url: string,
  language: SupportedLang = 'en',
  options?: { strictRw?: boolean },
): string {
  const clip = (content ?? '').slice(0, CONTENT_CHAR_LIMIT);

  if (language === 'rw') {
    const strictLine = options?.strictRw
      ? "NIBA umutwe usa n'itariki nka '06/05' cyangwa ari muto, uwirengagize kandi ukoreshe ibikubiye mu nkuru gusa."
      : "Irinde gukoresha umutwe umeze nk'itariki (nka '06/05') nk'incamake.";
    return [
      "Andika incamake y'inkuru mu nteruro 5 gusa, mu Kinyarwanda gisanzwe gikoreshwa mu makuru.",
      "Interuro ya mbere igaragaze igikorwa nyamukuru cy'inkuru; ntusubiremo umutwe nk'uko uri.",
      strictLine,
      `Interuro ya 5 igomba kurangira na: "Soma inkuru yose hano: ${url}".`,
      `Umutwe: ${title}`,
      `Ibikubiye: ${clip}`,
      'Subiza interuro 5 gusa, ntakindi.',
    ].join('\n');
  }

  if (language === 'fr') {
    return [
      'Résume en EXACTEMENT 5 phrases neutres et factuelles. En français.',
      `La 5e phrase doit se terminer par : "Lire l'article complet sur : ${url}".`,
      `Titre : ${title}`,
      `Contenu : ${clip}`,
      'Réponds uniquement les 5 phrases.',
    ].join('\n');
  }

  return [
    'Summarize in EXACTLY 5 neutral, factual sentences. English.',
    `Sentence 5 must end with: "Read the full story at: ${url}".`,
    `Title: ${title}`,
    `Content: ${clip}`,
    'Reply with the 5 sentences only.',
  ].join('\n');
}
