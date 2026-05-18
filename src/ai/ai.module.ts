import { Module } from '@nestjs/common';

import { AiService } from './ai.service';
import { AiOrchestratorService } from './ai-orchestrator.service';
import { SummaryCacheService } from './summary-cache.service';
import { GroqProvider } from './providers/groq.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { FallbackProvider } from './providers/fallback.provider';

@Module({
  providers: [
    GroqProvider,
    GeminiProvider,
    FallbackProvider,
    SummaryCacheService,
    AiOrchestratorService,
    AiService,
  ],
  exports: [AiService, AiOrchestratorService, SummaryCacheService],
})
export class AiModule {}
