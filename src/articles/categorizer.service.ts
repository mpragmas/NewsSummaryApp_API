import { Injectable } from '@nestjs/common';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Politics: [
    // English
    'election', 'government', 'president', 'minister', 'parliament', 'senate',
    'congress', 'political', 'vote', 'democracy', 'policy', 'legislation',
    'diplomat', 'treaty', 'sanctions', 'coup', 'protest', 'reform',
    // French
    'élection', 'gouvernement', 'président', 'ministre', 'parlement', 'sénat',
    'politique', 'vote', 'démocratie', 'loi', 'diplomate', 'traité', 'sanctions',
    'coup d\'état', 'manifestation', 'réforme', 'premier ministre',
  ],
  Business: [
    // English
    'economy', 'market', 'stock', 'trade', 'investment', 'bank', 'financial',
    'gdp', 'inflation', 'currency', 'startup', 'merger', 'acquisition',
    'revenue', 'profit', 'ipo', 'fund', 'corporate', 'industry',
    // French
    'économie', 'marché', 'bourse', 'commerce', 'investissement', 'banque',
    'financier', 'pib', 'inflation', 'devise', 'fusion', 'acquisition',
    'chiffre d\'affaires', 'bénéfice', 'fonds', 'entreprise', 'industrie',
  ],
  Technology: [
    // English
    'tech', 'ai', 'artificial intelligence', 'software', 'hardware', 'cybersecurity',
    'data', 'cloud', 'digital', 'internet', 'startup', 'silicon', 'algorithm',
    'robot', 'automation', 'blockchain', 'crypto', 'app', 'innovation',
    // French
    'technologie', 'intelligence artificielle', 'logiciel', 'matériel', 'cybersécurité',
    'données', 'numérique', 'internet', 'algorithme', 'robot', 'automatisation',
    'crypto', 'application', 'innovation',
  ],
  Health: [
    // English
    'health', 'hospital', 'disease', 'vaccine', 'pandemic', 'doctor', 'medical',
    'medicine', 'cancer', 'mental health', 'surgery', 'drug', 'clinical',
    'outbreak', 'epidemic', 'nutrition', 'who', 'covid',
    // French
    'santé', 'hôpital', 'maladie', 'vaccin', 'pandémie', 'médecin', 'médical',
    'médicament', 'cancer', 'santé mentale', 'chirurgie', 'épidémie',
    'nutrition', 'oms', 'covid',
  ],
  Sports: [
    // English
    'football', 'soccer', 'basketball', 'cricket', 'tennis', 'olympics',
    'world cup', 'league', 'championship', 'athlete', 'coach', 'tournament',
    'match', 'sport', 'fifa', 'nba', 'premier league', 'score',
    // French
    'football', 'basket', 'tennis', 'jeux olympiques', 'coupe du monde',
    'ligue', 'championnat', 'athlète', 'entraîneur', 'tournoi',
    'match', 'sport', 'but', 'victoire', 'défaite',
  ],
  Entertainment: [
    // English
    'movie', 'film', 'music', 'celebrity', 'award', 'oscar', 'grammy',
    'concert', 'album', 'actor', 'actress', 'tv show', 'netflix', 'streaming',
    'culture', 'fashion', 'art', 'theater', 'comedy',
    // French
    'film', 'musique', 'célébrité', 'prix', 'oscar', 'concert', 'album',
    'acteur', 'actrice', 'série', 'netflix', 'streaming', 'culture',
    'mode', 'art', 'théâtre', 'comédie',
  ],
  Science: [
    // English
    'science', 'research', 'study', 'space', 'nasa', 'climate', 'environment',
    'species', 'discovery', 'experiment', 'physics', 'biology', 'chemistry',
    'planet', 'fossil', 'gene', 'dna', 'universe', 'telescope',
    // French
    'science', 'recherche', 'étude', 'espace', 'climat', 'environnement',
    'espèce', 'découverte', 'expérience', 'physique', 'biologie', 'chimie',
    'planète', 'fossile', 'gène', 'adn', 'univers', 'télescope',
  ],
  Conflict: [
    // English
    'war', 'conflict', 'military', 'army', 'battle', 'troops', 'attack',
    'bombing', 'missile', 'weapon', 'ceasefire', 'peace', 'refugee',
    'insurgent', 'terrorism', 'hostage', 'soldier', 'nato',
    // French
    'guerre', 'conflit', 'militaire', 'armée', 'bataille', 'troupes', 'attaque',
    'bombardement', 'missile', 'arme', 'cessez-le-feu', 'paix', 'réfugié',
    'terrorisme', 'otage', 'soldat', 'otan',
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
