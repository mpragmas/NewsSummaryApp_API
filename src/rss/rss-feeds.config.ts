export type SupportedLanguage = 'en' | 'fr' | 'rw';

export interface RssFeedConfig {
  name: string;
  url: string;
  language: SupportedLanguage;
  continent: string;
  region: string;
  country: string;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // ── English — Global ────────────────────────────────────────────────────────
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'United Kingdom',
  },
  {
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'Global',
  },
  {
    name: 'BBC Sport Football',
    url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'Global',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'Qatar',
  },
  {
    name: 'The Guardian World',
    url: 'https://www.theguardian.com/world/rss',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'United Kingdom',
  },
  {
    name: 'CNN World',
    url: 'http://rss.cnn.com/rss/edition_world.rss',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'United States',
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    language: 'en',
    continent: 'North America',
    region: 'North America',
    country: 'United States',
  },

  // ── English — Africa ────────────────────────────────────────────────────────
  {
    name: 'AllAfrica',
    url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf',
    language: 'en',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
  {
    name: 'The Guardian Africa',
    url: 'https://www.theguardian.com/world/africa/rss',
    language: 'en',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
  {
    name: 'The East African',
    url: 'https://www.theeastafrican.co.ke/rss',
    language: 'en',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Kenya',
  },
  {
    name: 'Nation Africa',
    url: 'https://nation.africa/kenya/rss.xml',
    language: 'en',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Kenya',
  },
  {
    name: 'Daily Monitor Uganda',
    url: 'https://www.monitor.co.ug/rss',
    language: 'en',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Uganda',
  },

  // ── English — Rwanda ────────────────────────────────────────────────────────
  {
    name: 'The New Times Rwanda',
    url: 'https://www.newtimes.co.rw/rss.xml',
    language: 'en',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  {
    name: 'KT Press Rwanda',
    url: 'https://ktpress.rw/feed/',
    language: 'en',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },

  // ── French — Global ─────────────────────────────────────────────────────────
  {
    name: 'RFI',
    url: 'https://www.rfi.fr/fr/rss',
    language: 'fr',
    continent: 'Global',
    region: 'Global',
    country: 'France',
  },
  {
    name: 'France 24',
    url: 'https://www.france24.com/fr/rss',
    language: 'fr',
    continent: 'Global',
    region: 'Global',
    country: 'France',
  },
  {
    name: 'Le Monde',
    url: 'https://www.lemonde.fr/rss/une.xml',
    language: 'fr',
    continent: 'Global',
    region: 'Global',
    country: 'France',
  },

  // ── French — Africa ─────────────────────────────────────────────────────────
  {
    name: 'RFI Afrique',
    url: 'https://www.rfi.fr/fr/afrique/rss',
    language: 'fr',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
  {
    name: 'Jeune Afrique',
    url: 'https://www.jeuneafrique.com/feed/',
    language: 'fr',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
  {
    name: 'Africa News FR',
    url: 'https://fr.africanews.com/rss',
    language: 'fr',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
];
