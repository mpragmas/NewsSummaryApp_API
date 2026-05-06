import { Injectable, Logger } from '@nestjs/common';

import { AiOrchestratorService } from './ai-orchestrator.service';
import { SupportedLang } from './prompts';
import { ProviderName } from './providers/ai-provider.interface';

/**
 * Backwards-compatible facade over {@link AiOrchestratorService}.
 *
 * Existing call sites (`articles.service.ts`, controllers) keep working.
 * NEW callers should prefer enqueueing a `summarization` job via the
 * queue instead of calling this directly — see SummarizationQueueService.
 */

export type SummaryProvider = ProviderName;

export interface ProviderAttempt {
  provider: SummaryProvider;
  model: string;
  durationMs: number;
  success: boolean;
}

export interface ReviewDetails {
  modelUsed: string;
  providerAttempts: ProviderAttempt[];
  totalDurationMs: number;
}

export interface SummaryResult {
  text: string;
  provider: SummaryProvider;
  details?: ReviewDetails;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly orchestrator: AiOrchestratorService) {}

  async summarizeArticle(
    title: string,
    content: string,
    url: string,
    language: SupportedLang = 'en',
  ): Promise<SummaryResult> {
    const start = Date.now();
    const result = await this.orchestrator.summarize({
      title,
      content,
      url,
      language,
    });
    return {
      text: result.text,
      provider: result.provider,
      details: {
        modelUsed: result.provider,
        providerAttempts: [
          {
            provider: result.provider,
            model: result.provider,
            durationMs: Date.now() - start,
            success: true,
          },
        ],
        totalDurationMs: Date.now() - start,
      },
    };
  }

  /**
   * Sequential helper kept for the rare synchronous call site (admin
   * one-shot re-summarize of a single article). The ingest pipeline and
   * backfill endpoints now go through the queue instead.
   */
  async summarizeBatch(
    articles: Array<{
      title: string;
      content: string;
      url: string;
      language?: SupportedLang;
    }>,
  ): Promise<SummaryResult[]> {
    this.logger.warn(
      `summarizeBatch() called for ${articles.length} articles synchronously — prefer the queue for large batches.`,
    );

    const results: SummaryResult[] = [];
    for (const a of articles) {
      results.push(
        await this.summarizeArticle(
          a.title,
          a.content,
          a.url,
          a.language ?? 'en',
        ),
      );
    }
    return results;
  }

  getProviderStatus() {
    return this.orchestrator.getProviderStatus();
  }
}
