/**
 * Cheap, deterministic token estimator (no tokenizer dependency).
 * Roughly 1 token ≈ 4 characters of English / Latin script. Slightly
 * over-counts for multilingual text, which is the safer direction
 * when sizing a token-per-minute reservoir.
 */
export function estimateTokens(text: string | null | undefined): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/** Estimate total tokens (input + reserved output) for a single LLM request. */
export function estimateRequestTokens(
  prompt: string,
  maxOutputTokens: number,
): number {
  return estimateTokens(prompt) + maxOutputTokens;
}
