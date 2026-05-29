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

export const CLUSTERING_QUEUE = 'clustering';

export interface ClusterRecentJobData {
  /** What triggered the run (for logging/observability). */
  trigger: 'ingest' | 'scheduled' | 'manual';
  /** When true, wipe and rebuild all clusters instead of incremental. */
  rebuild?: boolean;
}

export interface ClusterRecentJobResult {
  scanned: number;
  attached: number;
  created: number;
  durationMs: number;
}
