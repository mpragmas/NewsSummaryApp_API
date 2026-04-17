import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BATCH_SIZE = 5;
const RETRY_DELAY_MS = 1000;
const MAX_RETRIES = 3;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-1.5-flash';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('gemini.apiKey') ?? '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async summarizeArticle(title: string, content: string, url: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const prompt = this.buildPrompt(title, content, url);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        return text;
      } catch (error) {
        const isLast = attempt === MAX_RETRIES;
        this.logger.warn(`Summarization attempt ${attempt}/${MAX_RETRIES} failed: ${(error as Error).message}`);
        if (isLast) throw error;
        await this.delay(RETRY_DELAY_MS * attempt);
      }
    }

    throw new Error('All summarization attempts failed');
  }

  async summarizeBatch(
    articles: Array<{ title: string; content: string; url: string }>,
  ): Promise<string[]> {
    const summaries: string[] = [];

    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((a) => this.summarizeArticle(a.title, a.content, a.url)),
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          summaries.push(result.value);
        } else {
          summaries.push('');
          this.logger.error(`Batch summarization failed: ${result.reason}`);
        }
      }

      // Respect Gemini rate limits between batches
      if (i + BATCH_SIZE < articles.length) {
        await this.delay(500);
      }
    }

    return summaries;
  }

  private buildPrompt(title: string, content: string, url: string): string {
    return `You are a professional news summarizer. Summarize the following news article in EXACTLY 5 sentences.

Rules:
- Write in a neutral, factual tone
- Do not add opinions or commentary
- Sentence 1: State the main event/topic
- Sentences 2-4: Provide key details, context, and implications
- Sentence 5: Must end with "Read the full story at: ${url}"

Article Title: ${title}

Article Content:
${content.substring(0, 3000)}

Provide ONLY the 5-sentence summary, nothing else.`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
