import { SupportedLang } from '../prompts';

export type ProviderName = 'groq' | 'gemini' | 'fallback';

export interface SummarizeInput {
  title: string;
  content: string;
  url: string;
  language: SupportedLang;
}

export interface AiProvider {
  readonly name: ProviderName;
  readonly model: string;
  /** Whether the provider was successfully wired up (api key present, etc). */
  readonly enabled: boolean;
  /**
   * Returns a non-empty summary string, or throws.
   * Throws should map to {@link RateLimitError}, {@link ProviderTransientError},
   * or {@link ProviderFatalError} so the orchestrator can react correctly.
   */
  summarize(input: SummarizeInput): Promise<string>;
}
