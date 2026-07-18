import { Logger } from '@nestjs/common';

import { RateLimitError } from '../common/errors/rate-limit.error';
import { JobLike } from './job-types';

export interface InProcessQueueOptions {
  /** Max jobs running at once. */
  concurrency: number;
  /** Total attempts per job (1 = no retry). */
  attempts: number;
  /** Base delay for exponential backoff between retries, in ms. */
  backoffMs: number;
  /**
   * When true, re-adding a jobId that is currently running schedules exactly
   * one follow-up run (used by clustering so a burst of ingests still ends with
   * a fresh pass). When false, a re-add of a running/pending id is ignored
   * (used by summarization for idempotent, no-double-spend enqueues).
   */
  coalesceRerun: boolean;
}

type Handler<T, R> = (job: JobLike<T>) => Promise<R>;

interface Counts {
  wait: number;
  active: number;
  delayed: number;
  completed: number;
  failed: number;
}

/** Longest a job may sit in backoff while holding a concurrency slot. */
const MAX_BACKOFF_MS = 60_000;

/**
 * A tiny, dependency-free job queue that runs entirely in this process.
 *
 * It intentionally reuses the same processor logic as the old BullMQ workers
 * (bounded concurrency, exponential backoff, provider Retry-After handling,
 * final-attempt fallback contract) but touches no Redis — which is what was
 * exhausting the Upstash per-command quota and taking the API down.
 *
 * Durability note: jobs live in memory, so a process restart drops in-flight
 * work. That's covered by the scheduled reconciliation pass which re-enqueues
 * any article still missing a summary (see SchedulerService).
 */
export class InProcessQueue<T, R> {
  private readonly logger: Logger;
  private readonly pending = new Map<string, JobLike<T>>();
  private readonly running = new Set<string>();
  private readonly rerun = new Set<string>();
  private completed = 0;
  private failed = 0;

  constructor(
    private readonly name: string,
    private readonly handler: Handler<T, R>,
    private readonly options: InProcessQueueOptions,
  ) {
    this.logger = new Logger(`Queue:${name}`);
  }

  /** Enqueue a job. `jobId` dedupes/coalesces (matches the old BullMQ jobIds). */
  add(jobId: string, data: T): void {
    if (this.running.has(jobId)) {
      if (this.options.coalesceRerun) this.rerun.add(jobId);
      return;
    }
    // Replacing the data of an already-pending id coalesces duplicate adds.
    this.pending.set(jobId, {
      id: jobId,
      data,
      attemptsMade: 0,
      opts: { attempts: this.options.attempts },
    });
    this.pump();
  }

  addBulk(entries: { jobId: string; data: T }[]): void {
    for (const e of entries) this.add(e.jobId, e.data);
  }

  counts(): Counts {
    return {
      wait: this.pending.size,
      active: this.running.size,
      delayed: 0,
      completed: this.completed,
      failed: this.failed,
    };
  }

  private pump(): void {
    while (
      this.running.size < this.options.concurrency &&
      this.pending.size > 0
    ) {
      const [jobId, job] = this.pending.entries().next().value as [
        string,
        JobLike<T>,
      ];
      this.pending.delete(jobId);
      this.running.add(jobId);
      // Fire and forget — runJob never rejects.
      void this.runJob(job);
    }
  }

  private async runJob(job: JobLike<T>): Promise<void> {
    try {
      for (let attempt = 0; attempt < this.options.attempts; attempt++) {
        job.attemptsMade = attempt;
        try {
          await this.handler(job);
          this.completed++;
          return;
        } catch (err) {
          const isLast = attempt + 1 >= this.options.attempts;
          if (isLast) {
            this.failed++;
            this.logger.error(
              `job=${job.id} failed after ${this.options.attempts} attempt(s): ${(err as Error).message}`,
            );
            return;
          }
          const delay =
            err instanceof RateLimitError
              ? err.retryAfterMs
              : this.options.backoffMs * 2 ** attempt;
          await this.sleep(Math.min(delay, MAX_BACKOFF_MS));
        }
      }
    } finally {
      this.running.delete(job.id);
      if (this.rerun.delete(job.id)) {
        // A re-add arrived while this was running — schedule one fresh pass.
        this.add(job.id, job.data);
      }
      this.pump();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
