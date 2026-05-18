export interface RwPipelineSnapshot {
  rwScrapedTotal: number;
  rwRejectedInvalid: number;
  rwRejectedLowQuality: number;
  rwAIEnhanced: number;
  rwFallbackUsed: number;
}

const state: RwPipelineSnapshot = {
  rwScrapedTotal: 0,
  rwRejectedInvalid: 0,
  rwRejectedLowQuality: 0,
  rwAIEnhanced: 0,
  rwFallbackUsed: 0,
};

export function recordRwScrapeBatch(metrics: {
  scrapedTotal: number;
  rejectedInvalid: number;
  rejectedLowQuality: number;
}) {
  state.rwScrapedTotal += metrics.scrapedTotal;
  state.rwRejectedInvalid += metrics.rejectedInvalid;
  state.rwRejectedLowQuality += metrics.rejectedLowQuality;
}

export function recordRwAiOutcome(provider: 'groq' | 'gemini' | 'fallback') {
  if (provider === 'fallback') state.rwFallbackUsed += 1;
  else state.rwAIEnhanced += 1;
}

export function getRwPipelineMetrics(): RwPipelineSnapshot {
  return { ...state };
}
