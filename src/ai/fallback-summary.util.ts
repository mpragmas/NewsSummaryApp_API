const URL_SUFFIX: Record<'en' | 'fr' | 'rw', string> = {
  en: 'Read the full story at:',
  fr: "Lire l'article complet sur :",
  rw: 'Soma inkuru yose hano:',
};

/**
 * Deterministic local summarizer — the final safety net.
 * Guaranteed to return a non-empty string regardless of input.
 * Takes the first 2-3 sentences of the content and appends the source URL.
 */
export function fallbackSummary(
  content: string,
  title: string,
  url: string,
  language: 'en' | 'fr' | 'rw' = 'en',
): string {
  const cleaned = (content ?? '').replace(/\s+/g, ' ').trim();
  const safeTitle = (title ?? '').trim() || 'Article';
  const urlSuffix = ` ${URL_SUFFIX[language]} ${url}`;

  if (!cleaned) {
    return `${safeTitle}.${urlSuffix}`;
  }

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let body: string;

  if (sentences.length === 0) {
    body = cleaned.substring(0, 300).trim();
    if (body.length < cleaned.length) body += '…';
  } else if (sentences.length <= 3) {
    body = sentences.join(' ');
  } else {
    body = sentences.slice(0, 3).join(' ');
  }

  if (!/[.!?]$/.test(body)) body += '.';

  return body + urlSuffix;
}
