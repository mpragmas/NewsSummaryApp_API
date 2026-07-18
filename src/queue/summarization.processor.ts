import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { fallbackSummary } from '../ai/fallback-summary.util';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitError } from '../common/errors/rate-limit.error';
import { sanitizeContentForAI } from '../common/util/article-validation';
import { getRwPipelineMetrics, recordRwAiOutcome } from '../common/util/rw-pipeline-metrics';
import {
  JobLike,
  SummarizeArticleJobData,
  SummarizeArticleJobResult,
  UnrecoverableError,
} from './job-types';

/**
 * Summarization job handler.
 *
 * Runs on the in-process queue (no Redis). Concurrency is applied by the queue
 * and is intentionally low: the *real* throttle lives inside Bottleneck on each
 * provider — we just want a couple of concurrent in-flight jobs so cache hits
 * and fallbacks don't block AI-bound jobs.
 *
 * Retry policy (driven by the queue via `job.opts.attempts`):
 *  - Exponential backoff for transient errors
 *  - 429s ask the queue to wait `retryAfterMs` via the thrown RateLimitError
 *  - On final failure we WRITE the local fallback summary so the DB is never
 *    left with a NULL slot, satisfying the engineering contract.
 */
@Injectable()
export class SummarizationProcessor {
  private readonly logger = new Logger(SummarizationProcessor.name);

  constructor(
    private readonly orchestrator: AiOrchestratorService,
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    const concurrency =
      config.get<number>('queue.summarizationConcurrency') ?? 2;
    this.logger.log(
      `SummarizationProcessor ready (concurrency: ${concurrency})`,
    );
  }

  async process(
    job: JobLike<SummarizeArticleJobData>,
  ): Promise<SummarizeArticleJobResult> {
    const start = Date.now();
    const { articleId, title, content, url, language, field } = job.data;
    const sanitizedContent = sanitizeContentForAI(content);

    try {
      const result = await this.orchestrator.summarize({
        title,
        content: sanitizedContent,
        url,
        language,
      });

      await this.prisma.article.update({
        where: { id: articleId },
        data: { [field]: result.text },
      });

      const durationMs = Date.now() - start;
      this.logger.log(
        `job=${job.id} articleId=${articleId} provider=${result.provider} cached=${result.cached} field=${field} ${durationMs}ms`,
      );
      if (language === 'rw') {
        recordRwAiOutcome(result.provider === 'fallback' ? 'fallback' : result.provider);
        const snapshot = getRwPipelineMetrics();
        this.logger.log(
          `[RW PIPELINE] scraped=${snapshot.rwScrapedTotal}, rejected=${snapshot.rwRejectedInvalid + snapshot.rwRejectedLowQuality}, ai=${snapshot.rwAIEnhanced}, fallback=${snapshot.rwFallbackUsed}`,
        );
      }

      return {
        articleId,
        provider: result.provider,
        cached: result.cached,
        durationMs,
      };
    } catch (err) {
      // Honor provider Retry-After: re-throw so the queue waits exactly the
      // time the provider asked for before the next attempt.
      if (err instanceof RateLimitError) {
        this.logger.warn(
          `job=${job.id} hit ${err.provider} rate limit; delaying ${Math.round(err.retryAfterMs / 1000)}s`,
        );
        throw err;
      }

      // If we've burned through all attempts, refuse to leave the DB blank.
      if (job.attemptsMade + 1 >= job.opts.attempts) {
        const safe = fallbackSummary(sanitizedContent, title, url, language);
        try {
          await this.prisma.article.update({
            where: { id: articleId },
            data: { [field]: safe },
          });
          this.logger.error(
            `job=${job.id} articleId=${articleId} all retries exhausted — wrote local fallback. Last error: ${(err as Error).message}`,
          );
          if (language === 'rw') {
            recordRwAiOutcome('fallback');
            const snapshot = getRwPipelineMetrics();
            this.logger.log(
              `[RW PIPELINE] scraped=${snapshot.rwScrapedTotal}, rejected=${snapshot.rwRejectedInvalid + snapshot.rwRejectedLowQuality}, ai=${snapshot.rwAIEnhanced}, fallback=${snapshot.rwFallbackUsed}`,
            );
          }
          return {
            articleId,
            provider: 'fallback',
            cached: false,
            durationMs: Date.now() - start,
          };
        } catch (dbErr) {
          this.logger.error(
            `job=${job.id} fallback write failed: ${(dbErr as Error).message}`,
          );
          // Terminal — don't loop forever on a DB that won't accept the write.
          throw new UnrecoverableError((dbErr as Error).message);
        }
      }

      throw err;
    }
  }
}
