import { Injectable } from '@nestjs/common';
import { SupportedLang } from '../ai/prompts';
import { CanonicalCategory } from './category-i18n.util';

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
    // Kinyarwanda
    'leta', 'guverinoma', 'minisitiri', 'inteko', 'amatora', 'politiki',
    'itegeko', 'dipolomasi', 'imiryango ya leta', 'umukuru w\'igihugu',
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
    // Kinyarwanda
    'ubucuruzi', 'isoko', 'ishoramari', 'banki', 'ifaranga', 'ubukungu',
    'inyungu', 'igihombo', 'uruganda', 'imisoro',
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
    // Kinyarwanda
    'ikoranabuhanga', 'mudasobwa', 'interineti', 'porogaramu', 'amakuru y\'ikoranabuhanga',
    'ubwenge bw\'ubukorano', 'robot', 'amakuru y\'ikoranabuhanga',
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
    // Kinyarwanda
    'ubuzima', 'ibitaro', 'indwara', 'urukingo', 'umuganga', 'ubuvuzi',
    'imiti', 'icyorezo', 'covid', 'imirire',
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
    // Kinyarwanda
    'imikino', 'umupira', 'football', 'basket', 'irushanwa', 'championnat',
    'umukinnyi', 'itsinda', 'intsinzi', 'igitego',
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
    // Kinyarwanda
    'imyidagaduro', 'umuziki', 'filime', 'abahanzi', 'igitaramo', 'umuco',
    'imyambarire', 'ikinamico',
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
    // Kinyarwanda
    'ubumenyi', 'ubushakashatsi', 'ikigero', 'ikirere', 'ikirunga', 'ibidukikije',
    'ivumburwa', 'igerageza', 'isanzure',
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
    // Kinyarwanda
    'intambara', 'amakimbirane', 'igisirikare', 'igitero', 'ibisasu',
    'amahoro', 'impunzi', 'iterabwoba', 'abashinzwe umutekano',
  ],
};

@Injectable()
export class CategorizerService {
  categorize(
    title: string,
    content: string,
    language: SupportedLang = 'en',
  ): CanonicalCategory {
    const titleText = (title ?? '').toLowerCase();
    const contentText = (content ?? '').toLowerCase();
    const text = `${titleText} ${contentText}`;
    const scores: Record<string, number> = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      scores[category] = 0;
      for (const keyword of keywords) {
        const k = keyword.toLowerCase();
        // Title hits are much more indicative for news taxonomy.
        if (titleText.includes(k)) {
          scores[category] += 3;
        } else if (contentText.includes(k)) {
          scores[category] += 1;
        }
      }
    }

    // RW heuristic: "ubuzima", "ikoranabuhanga", etc. should dominate
    // over weak generic English matches.
    if (language === 'rw') {
      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const rwBoost = keywords.filter(
          (k) => /[a-z]/i.test(k) && !/[éèêàçùôî]/i.test(k) && k.includes(' '),
        );
        for (const keyword of rwBoost) {
          if (text.includes(keyword.toLowerCase())) {
            scores[category] += 1;
          }
        }
      }
    }

    const best = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    return best && best[1] > 0 ? (best[0] as CanonicalCategory) : 'General';
  }
}
