import { Injectable } from '@nestjs/common';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Politics: [
    'election', 'government', 'president', 'minister', 'parliament', 'senate',
    'congress', 'political', 'vote', 'democracy', 'policy', 'legislation',
    'diplomat', 'treaty', 'sanctions', 'coup', 'protest', 'reform',
  ],
  Business: [
    'economy', 'market', 'stock', 'trade', 'investment', 'bank', 'financial',
    'gdp', 'inflation', 'currency', 'startup', 'merger', 'acquisition',
    'revenue', 'profit', 'ipo', 'fund', 'corporate', 'industry',
  ],
  Technology: [
    'tech', 'ai', 'artificial intelligence', 'software', 'hardware', 'cybersecurity',
    'data', 'cloud', 'digital', 'internet', 'startup', 'silicon', 'algorithm',
    'robot', 'automation', 'blockchain', 'crypto', 'app', 'innovation',
  ],
  Health: [
    'health', 'hospital', 'disease', 'vaccine', 'pandemic', 'doctor', 'medical',
    'medicine', 'cancer', 'mental health', 'surgery', 'drug', 'clinical',
    'outbreak', 'epidemic', 'nutrition', 'who', 'covid',
  ],
  Sports: [
    'football', 'soccer', 'basketball', 'cricket', 'tennis', 'olympics',
    'world cup', 'league', 'championship', 'athlete', 'coach', 'tournament',
    'match', 'sport', 'fifa', 'nba', 'premier league', 'score',
  ],
  Entertainment: [
    'movie', 'film', 'music', 'celebrity', 'award', 'oscar', 'grammy',
    'concert', 'album', 'actor', 'actress', 'tv show', 'netflix', 'streaming',
    'culture', 'fashion', 'art', 'theater', 'comedy',
  ],
  Science: [
    'science', 'research', 'study', 'space', 'nasa', 'climate', 'environment',
    'species', 'discovery', 'experiment', 'physics', 'biology', 'chemistry',
    'planet', 'fossil', 'gene', 'dna', 'universe', 'telescope',
  ],
  Conflict: [
    'war', 'conflict', 'military', 'army', 'battle', 'troops', 'attack',
    'bombing', 'missile', 'weapon', 'ceasefire', 'peace', 'refugee',
    'insurgent', 'terrorism', 'hostage', 'soldier', 'nato',
  ],
};

@Injectable()
export class CategorizerService {
  categorize(title: string, content: string): string {
    const text = `${title} ${content}`.toLowerCase();
    const scores: Record<string, number> = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      scores[category] = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          scores[category]++;
        }
      }
    }

    const best = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    return best && best[1] > 0 ? best[0] : 'General';
  }
}
