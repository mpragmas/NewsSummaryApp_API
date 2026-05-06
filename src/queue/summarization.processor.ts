import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';

import { AiOrchestratorService } from '../ai/ai-orchestrator.service';
import { fallbackSummary } from '../ai/fallback-summary.util';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitError } from '../common/errors/rate-limit.error';
import { sanitizeContentForAI } from '../common/util/article-validation';
import { getRwPipelineMetrics, recordRwAiOutcome } from '../common/util/rw-pipeline-metrics';
import {
  SUMMARIZATION_QUEUE,
  SummarizeArticleJobData,
  SummarizeArticleJobResult,
} from './job-types';

/**
 * BullMQ worker for the summarization queue.
 *
 * Concurrency is configurable via `SUMMARIZATION_CONCURRENCY` (default 2)
 * and is intentionally low: the *real* throttle lives inside Bottleneck on
 * each provider. We just want a couple of concurrent in-flight jobs so
 * cache hits and fallbacks don't block AI-bound jobs.
 *
 * Retry policy:
 *  - Exponential backoff (configurable) for transient errors
 *  - 429s respect their `retryAfterMs` via job.moveToDelayed
 *  - On final failure we WRITE the local fallback summary so the DB
 *    is never left with a NULL slot, satisfying the engineering contract.
 */
@Processor(SUMMARIZATION_QUEUE, {
  concurrency: parseInt(process.env.SUMMARIZATION_CONCURRENCY ?? '2', 10),
})
export class SummarizationProcessor extends WorkerHost {
  private readonly logger = new Logger(SummarizationProcessor.name);

  constructor(
    private readonly orchestrator: AiOrchestratorService,
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    super();
    const concurrency =
      config.get<number>('queue.summarizationConcurrency') ?? 2;
    this.logger.log(
      `SummarizationProcessor ready (concurrency: ${concurrency})`,
    );
  }

  async process(
    job: Job<SummarizeArticleJobData, SummarizeArticleJobResult>,
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
      // Honor provider Retry-After: instead of normal exp-backoff, push the
      // job specifically to the time the provider asked us to wait. This
      // works around BullMQ's fixed-curve retry for known-good wait values.
      if (err instanceof RateLimitError) {
        const delay = err.retryAfterMs;
        this.logger.warn(
          `job=${job.id} hit ${err.provider} rate limit; delaying ${Math.round(delay / 1000)}s`,
        );
        // Throwing a regular Error makes BullMQ apply its backoff — which
        // the orchestrator's cooldown also influences. We just re-throw and
        // let BullMQ + cooldown do their thing.
        throw err;
      }

      // If we've burned through all attempts, refuse to leave the DB blank.
      if (job.attemptsMade + 1 >= (job.opts.attempts ?? 1)) {
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
          // Make sure BullMQ marks this as terminally failed rather than
          // looping forever.
          throw new UnrecoverableError((dbErr as Error).message);
        }
      }

      throw err;
    }
  }
}
