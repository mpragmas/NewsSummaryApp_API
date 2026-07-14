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
  const safeTitle = (title ?? '').replace(/\s+/g, ' ').trim() || 'Article';
  const urlSuffix = ` ${URL_SUFFIX[language]} ${url}`;
  const titleLooksLikeDate = /^\d{2}\/\d{2}$/.test(safeTitle);

  if (language === 'rw') {
    const rwSummary = fallbackSummaryRw(cleaned, safeTitle, titleLooksLikeDate, url);
    return rwSummary;
  }

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

function fallbackSummaryRw(
  cleaned: string,
  safeTitle: string,
  titleLooksLikeDate: boolean,
  url: string,
): string {
  const urlLine = `${URL_SUFFIX.rw} ${url}`;

  // Extractive fallback: use the article's OWN sentences (like the en/fr
  // fallback) instead of generic filler. Generic boilerplate reads as "not
  // summarized" to Kinyarwanda readers even though a summary was written.
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let body: string;
  if (sentences.length === 0) {
    // No sentence punctuation — take a leading excerpt of the real content.
    body = cleaned.slice(0, 300).trim();
    if (body && body.length < cleaned.length) body += '…';
  } else {
    body = sentences.slice(0, 3).join(' ');
  }

  if (!body) {
    // Genuinely empty content: fall back to the (non-date) title so the card
    // still says something concrete about the article.
    body = titleLooksLikeDate ? 'Inkuru mishya yo mu Rwanda.' : `${safeTitle}.`;
  }

  if (!/[.!?…]$/.test(body)) body += '.';

  return `${body} ${urlLine}`.replace(/\s+/g, ' ').trim();
}
