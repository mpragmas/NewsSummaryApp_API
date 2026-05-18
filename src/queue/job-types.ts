import { SupportedLang } from '../ai/prompts';

export const SUMMARIZATION_QUEUE = 'summarization';

export interface SummarizeArticleJobData {
  articleId: string;
  title: string;
  content: string;
  url: string;
  language: SupportedLang;
  /** Which DB column to update with the result. */
  field: 'summary' | 'summaryFr' | 'summaryRw';
  /** Trace correlation id for the originating request. */
  correlationId?: string;
}

export interface SummarizeArticleJobResult {
  articleId: string;
  provider: string;
  cached: boolean;
  durationMs: number;
}
