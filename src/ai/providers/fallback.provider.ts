import { Injectable, Logger } from '@nestjs/common';

import { fallbackSummary } from '../fallback-summary.util';
import { AiProvider, SummarizeInput } from './ai-provider.interface';

@Injectable()
export class FallbackProvider implements AiProvider {
  readonly name = 'fallback' as const;
  readonly model = 'local-deterministic';
  readonly enabled = true;

  private readonly logger = new Logger(FallbackProvider.name);

  summarize(input: SummarizeInput): Promise<string> {
    const text = fallbackSummary(
      input.content,
      input.title,
      input.url,
      input.language,
    );
    this.logger.warn(
      `Local fallback used: "${input.title.slice(0, 50)}" [${input.language}]`,
    );
    return Promise.resolve(text);
  }
}
