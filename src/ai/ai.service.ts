import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName = 'gemini-2.0-flash';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('❌ GEMINI_API_KEY is missing in .env');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.logger.log(`✅ Gemini initialized with model: ${this.modelName}`);
  }

  // 🔹 Single article summarization
  async summarizeArticle(
    title: string,
    content: string,
    url: string,
  ): Promise<string | null> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
      });

      const prompt = this.buildPrompt(title, content, url);

      const result = await model.generateContent(prompt);

      // 🔥 SAFE extraction
      const text =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        this.logger.error(
          '❌ Empty Gemini response:',
          JSON.stringify(result, null, 2),
        );
        return null;
      }

      this.logger.log(`✅ Summary generated for: ${title.substring(0, 50)}...`);
      return text;
    } catch (error) {
      this.logger.error(
        `❌ Gemini error: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`,
      );

      return null;
    }
  }

  // 🔹 Batch summarization (SAFE VERSION)
  async summarizeBatch(
    articles: Array<{ title: string; content: string; url: string }>,
  ): Promise<(string | null)[]> {
    this.logger.log(`🚀 Summarizing ${articles.length} articles...`);

    const results: (string | null)[] = [];

    for (const article of articles) {
      try {
        const summary = await this.summarizeArticle(
          article.title,
          article.content,
          article.url,
        );

        if (!summary) {
          this.logger.warn(`⚠️ No summary for: ${article.title}`);
          results.push(null);
          continue;
        }

        results.push(summary);
      } catch (err) {
        this.logger.error(
          `❌ Failed article: ${article.title} → ${
            err instanceof Error ? err.message : err
          }`,
        );
        results.push(null);
      }

      // ⏱️ Small delay to avoid rate limits
      await this.delay(800);
    }

    const success = results.filter(Boolean).length;
    const fail = results.length - success;

    this.logger.log(`✅ Done: ${success} success, ${fail} failed`);

    return results;
  }

  // 🔹 Prompt
  private buildPrompt(title: string, content: string, url: string): string {
    return `Summarize the following news article into EXACTLY 5 sentences.

Rules:
- Neutral tone
- No opinions
- Sentence 1: Main event
- Sentence 2-4: Key details
- Sentence 5: Must end with "Read the full story at: ${url}"

Title: ${title}

Content:
${content.substring(0, 2000)}

Return ONLY the 5 sentences.`;
  }

  private delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
