/**
 * Deterministic local summarizer — the final safety net.
 * Guaranteed to return a non-empty string regardless of input.
 * Takes the first 2-3 sentences of the content and appends the source URL.
 */
export function fallbackSummary(
  content: string,
  title: string,
  url: string,
): string {
  const cleaned = (content ?? '').replace(/\s+/g, ' ').trim();
  const safeTitle = (title ?? '').trim() || 'Article';
  const urlSuffix = ` Read the full story at: ${url}`;

  if (!cleaned) {
    return `${safeTitle}.${urlSuffix}`;
  }

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let body: string;

  if (sentences.length === 0) {
    // Text has no sentence terminators — take first 300 chars
    body = cleaned.substring(0, 300).trim();
    if (body.length < cleaned.length) body += '…';
  } else if (sentences.length <= 3) {
    body = sentences.join(' ');
  } else {
    body = sentences.slice(0, 3).join(' ');
  }

  // Ensure terminal punctuation before appending the URL sentence
  if (!/[.!?]$/.test(body)) body += '.';

  return body + urlSuffix;
}
