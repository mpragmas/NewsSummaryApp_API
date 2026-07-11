const MAX_SENTENCES = 5;

/**
 * LLMs occasionally ignore the "5 sentences only" instruction and return
 * markdown lists, headers, or a wall of extra sentences. This is the single
 * guardrail applied to every provider's raw output before it's cached/stored,
 * so a misbehaving model can never balloon into a 20-line summary.
 */
export function normalizeSummary(raw: string): string {
  const stripped = raw
    .replace(/\r/g, '')
    // drop markdown list/heading markers at line start ("- ", "* ", "1. ", "### ")
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').replace(/^#+\s*/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = stripped
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= MAX_SENTENCES) return stripped;

  const last = sentences[sentences.length - 1];
  const lastIsUrlSentence = /https?:\/\//.test(last);

  const kept = lastIsUrlSentence
    ? [...sentences.slice(0, MAX_SENTENCES - 1), last]
    : sentences.slice(0, MAX_SENTENCES);

  return kept.join(' ');
}
