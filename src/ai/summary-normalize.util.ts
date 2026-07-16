const MAX_SENTENCES = 5;

/**
 * Weaker models (especially on Kinyarwanda) sometimes echo the prompt's
 * sentence structure as literal labels — "Interuro ya 1:", "Sentence 2:",
 * "Phrase 3:" — at the start of each sentence, which reads as un-summarized
 * output. Strip such a label only when it opens a sentence and is followed by
 * a number/ordinal + separator, so ordinary prose is never touched.
 */
const SENTENCE_LABEL =
  /^(?:interuro\s+ya\s+(?:mbere|kabiri|gatatu|kane|gatanu|\d+)|sentence\s+\d+|phrase\s+\d+)\s*[:.\-)]+\s*/i;

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
    .map((s) => s.trim().replace(SENTENCE_LABEL, '').trim())
    .filter(Boolean);

  if (sentences.length <= MAX_SENTENCES) return sentences.join(' ');

  const last = sentences[sentences.length - 1];
  const lastIsUrlSentence = /https?:\/\//.test(last);

  const kept = lastIsUrlSentence
    ? [...sentences.slice(0, MAX_SENTENCES - 1), last]
    : sentences.slice(0, MAX_SENTENCES);

  return kept.join(' ');
}
