import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fallbackSummary } from './fallback-summary.util';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TIMEOUT_MS = 15_000;
const GEMINI_TIMEOUT_MS = 20_000;
const BATCH_DELAY_MS = 400;

export type SummaryProvider = 'groq' | 'gemini' | 'fallback';

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
  private readonly geminiClient: GoogleGenerativeAI | null = null;
  private readonly geminiModel = 'gemini-2.0-flash';
  private readonly groqApiKey: string | null = null;
  private readonly groqModel = 'llama-3.1-8b-instant';
  private readonly reviewDetailsEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    const groqKey = this.configService.get<string>('GROQ_API_KEY');
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (groqKey) {
      this.groqApiKey = groqKey;
      this.logger.log(`✅ Groq primary initialized (${this.groqModel})`);
    } else {
      this.logger.warn('⚠️  GROQ_API_KEY not set — Groq primary disabled');
    }

    if (geminiKey) {
      this.geminiClient = new GoogleGenerativeAI(geminiKey);
      this.logger.log(`✅ Gemini secondary initialized (${this.geminiModel})`);
    } else {
      this.logger.warn('⚠️  GEMINI_API_KEY not set — Gemini secondary disabled');
    }

    this.logger.log('🛟 Local fallback summarizer always available (final safety net)');

    this.reviewDetailsEnabled =
      this.configService.get<boolean>('reviews.reviewDetails') ?? false;
    if (this.reviewDetailsEnabled) {
      this.logger.log(
        '📊 Review details enabled — model, timing, and provider metadata will be attached to results',
      );
    }
  }

  /**
   * Summarize a single article. ALWAYS returns a non-empty summary string.
   * Strategy: Groq → Gemini → deterministic local fallback.
   * Each provider gets exactly 1 attempt (no retry loops).
   */
  async summarizeArticle(
    title: string,
    content: string,
    url: string,
    language: 'en' | 'fr' = 'en',
  ): Promise<SummaryResult> {
    const shortTitle = title.substring(0, 60);
    const prompt = this.buildPrompt(title, content, url, language);
    const startTotal = Date.now();
    const attempts: ProviderAttempt[] = [];

    this.logger.log(`📤 Summarizing: "${shortTitle}"`);

    // 1. Groq (primary) — single attempt
    if (this.groqApiKey) {
      const t0 = Date.now();
      const groq = await this.tryGroq(prompt, shortTitle);
      attempts.push({ provider: 'groq', model: this.groqModel, durationMs: Date.now() - t0, success: !!groq });
      if (groq) {
        return { text: groq, provider: 'groq', details: this.buildDetails(this.groqModel, attempts, startTotal) };
      }
      this.logger.warn(`⚠️  Groq failed — trying Gemini for "${shortTitle}"`);
    }

    // 2. Gemini (secondary) — single attempt
    if (this.geminiClient) {
      const t0 = Date.now();
      const gemini = await this.tryGemini(prompt, shortTitle);
      attempts.push({ provider: 'gemini', model: this.geminiModel, durationMs: Date.now() - t0, success: !!gemini });
      if (gemini) {
        return { text: gemini, provider: 'gemini', details: this.buildDetails(this.geminiModel, attempts, startTotal) };
      }
      this.logger.warn(`⚠️  Gemini failed — using local fallback for "${shortTitle}"`);
    }

    // 3. Local fallback — guaranteed non-empty
    const t0 = Date.now();
    const text = fallbackSummary(content, title, url, language);
    attempts.push({ provider: 'fallback', model: 'local-fallback', durationMs: Date.now() - t0, success: true });
    this.logger.log(`🔧 Local fallback used for: "${shortTitle}"`);
    return { text, provider: 'fallback', details: this.buildDetails('local-fallback', attempts, startTotal) };
  }

  /**
   * Summarize a batch sequentially. Returns a same-length array where every
   * entry has a non-empty summary (AI-generated or deterministic fallback).
   * Each article may carry its own `language` — defaults to 'en'.
   */
  async summarizeBatch(
    articles: Array<{ title: string; content: string; url: string; language?: 'en' | 'fr' }>,
  ): Promise<SummaryResult[]> {
    this.logger.log(`🚀 Batch summarization started: ${articles.length} articles`);
    const results: SummaryResult[] = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      this.logger.log(
        `📄 [${i + 1}/${articles.length}] [${article.language ?? 'en'}] "${article.title.substring(0, 50)}"`,
      );

      try {
        const result = await this.summarizeArticle(
          article.title,
          article.content,
          article.url,
          article.language ?? 'en',
        );
        results.push(result);
      } catch (err) {
        // Defensive — summarizeArticle() catches everything internally, but
        // if something leaks through we still guarantee a non-null summary.
        this.logger.error(
          `❌ [${i + 1}/${articles.length}] Unexpected error: ${(err as Error).message} — using local fallback`,
        );
        results.push({
          text: fallbackSummary(article.content, article.title, article.url, article.language ?? 'en'),
          provider: 'fallback',
        });
      }

      if (i < articles.length - 1) await this.sleep(BATCH_DELAY_MS);
    }

    const counts = results.reduce(
      (acc, r) => {
        acc[r.provider]++;
        return acc;
      },
      { groq: 0, gemini: 0, fallback: 0 },
    );

    this.logger.log(
      `✅ Batch complete: ${counts.groq} Groq, ${counts.gemini} Gemini, ${counts.fallback} fallback (${results.length} total)`,
    );

    return results;
  }

  // ─── Private provider helpers ─────────────────────────────────────────────

  private async tryGroq(prompt: string, shortTitle: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    try {
      this.logger.debug(`📡 Groq → "${shortTitle}"`);

      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.groqApiKey}`,
        },
        body: JSON.stringify({
          model: this.groqModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 512,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        const errType = this.classifyHttpError(response.status, body);
        this.logger.error(
          `❌ Groq [${errType}] "${shortTitle}": HTTP ${response.status} — ${body.substring(0, 200)}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const text = data?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        this.logger.error(`❌ Groq empty response for "${shortTitle}"`);
        return null;
      }

      this.logger.log(`✅ Groq OK: "${shortTitle}"`);
      return text;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `❌ Groq [${this.classifyError(err)}] "${shortTitle}": ${err.message}`,
      );
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async tryGemini(prompt: string, shortTitle: string): Promise<string | null> {
    try {
      this.logger.debug(`📡 Gemini → "${shortTitle}"`);
      const model = this.geminiClient!.getGenerativeModel({ model: this.geminiModel });

      // Gemini SDK has no native timeout — race against a hard deadline.
      const response = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Gemini timeout')),
            GEMINI_TIMEOUT_MS,
          ),
        ),
      ]);

      const text =
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        this.logger.error(`❌ Gemini empty response for "${shortTitle}"`);
        return null;
      }

      this.logger.log(`✅ Gemini OK: "${shortTitle}"`);
      return text;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `❌ Gemini [${this.classifyError(err)}] "${shortTitle}": ${err.message}`,
      );
      return null;
    }
  }

  // ─── Error classification (for structured logs) ───────────────────────────

  private classifyError(error: Error): string {
    const msg = error.message.toLowerCase();
    if (msg.includes('429') || msg.includes('rate limit')) return 'RATE_LIMIT';
    if (msg.includes('quota') || msg.includes('exhausted')) return 'QUOTA_EXHAUSTED';
    if (msg.includes('decommissioned') || msg.includes('deprecated'))
      return 'MODEL_DECOMMISSIONED';
    if (
      msg.includes('401') ||
      msg.includes('403') ||
      msg.includes('invalid api key') ||
      msg.includes('permission denied')
    )
      return 'AUTH_ERROR';
    if (msg.includes('timeout') || msg.includes('aborted')) return 'TIMEOUT';
    if (
      msg.includes('enotfound') ||
      msg.includes('econnrefused') ||
      msg.includes('network') ||
      msg.includes('fetch failed')
    )
      return 'NETWORK_ERROR';
    return 'UNKNOWN_ERROR';
  }

  private classifyHttpError(status: number, body: string): string {
    const b = body.toLowerCase();
    if (status === 429) return 'RATE_LIMIT';
    if (status === 401 || status === 403) return 'AUTH_ERROR';
    if (b.includes('decommissioned') || b.includes('deprecated'))
      return 'MODEL_DECOMMISSIONED';
    if (b.includes('quota')) return 'QUOTA_EXHAUSTED';
    if (status >= 500) return 'SERVER_ERROR';
    return `HTTP_${status}`;
  }

  // ─── Prompt ───────────────────────────────────────────────────────────────

  private buildPrompt(title: string, content: string, url: string, language: 'en' | 'fr' = 'en'): string {
    if (language === 'fr') {
      return `Résumez l'article de presse suivant en EXACTEMENT 5 phrases. Rédigez en français.

Règles :
- Ton neutre et factuel
- Aucune opinion personnelle
- Phrase 1 : Événement principal
- Phrases 2 à 4 : Détails clés
- Phrase 5 : Doit se terminer par "Lire l'article complet sur : ${url}"

Titre : ${title}

Contenu :
${content.substring(0, 2000)}

Retournez UNIQUEMENT les 5 phrases. N'ajoutez pas de titres, de puces ou de texte supplémentaire.`;
    }

    return `Summarize the following news article into EXACTLY 5 sentences.

Rules:
- Neutral tone
- No opinions
- Sentence 1: Main event
- Sentences 2-4: Key details
- Sentence 5: Must end with "Read the full story at: ${url}"

Title: ${title}

Content:
${content.substring(0, 2000)}

Return ONLY the 5 sentences. Do not add headings, bullet points, or extra text.`;
  }

  private buildDetails(
    modelUsed: string,
    attempts: ProviderAttempt[],
    startTotal: number,
  ): ReviewDetails | undefined {
    if (!this.reviewDetailsEnabled) return undefined;
    return { modelUsed, providerAttempts: attempts, totalDurationMs: Date.now() - startTotal };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
