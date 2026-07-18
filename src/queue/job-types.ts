import { SupportedLang } from '../ai/prompts';

/**
 * Minimal job shape shared by the in-process queue and the processors.
 * Mirrors the handful of BullMQ `Job` fields the processors actually read,
 * so the existing processor logic works unchanged without a Redis-backed queue.
 */
export interface JobLike<T> {
  id: string;
  data: T;
  /** 0-based count of attempts already made before the current one. */
  attemptsMade: number;
  opts: { attempts: number };
}

/** Marks a failure that must not be retried (BullMQ-compatible semantics). */
export class UnrecoverableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnrecoverableError';
  }
}

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
