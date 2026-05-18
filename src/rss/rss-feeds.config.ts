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
  // ── English feeds ──────────────────────────────────────────────────────────
  {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    language: 'en',
    continent: 'Europe',
    region: 'Western Europe',
    country: 'United Kingdom',
  },
  {
    name: 'BBC World',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'Global',
  },
  {
    name: 'BBC World',
    url: 'http://feeds.bbci.co.uk/sport/football/rss.xml',
    language: 'en',
    continent: 'Global',
    region: 'Global',
    country: 'Global',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    language: 'en',
    continent: 'Asia',
    region: 'Middle East',
    country: 'Qatar',
  },
  {
    name: 'AllAfrica',
    url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf',
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
  {
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/topNews',
    language: 'en',
    continent: 'North America',
    region: 'North America',
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

  // ── French feeds ───────────────────────────────────────────────────────────
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
    name: 'Jeune Afrique',
    url: 'https://www.jeuneafrique.com/feed/',
    language: 'fr',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
];
