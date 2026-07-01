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

  // ── Kinyarwanda — Rwanda ────────────────────────────────────────────────────
  // Igihe's legacy SPIP backend feed. NOTE (2026): igihe.com migrated to a
  // Next.js frontend and this `spip.php?page=backend` endpoint now returns an
  // EMPTY body (HTTP 200, 0 bytes) — it no longer yields articles. rss.service
  // handles the empty response gracefully (parse fails → [] → other feeds carry
  // RW news). It's kept here as a cheap probe in case the endpoint is restored;
  // fresh RW volume now comes from Umuseke/Imvaho/Umuryango/Intyoza/Rushyashya
  // below (plus the HTML scraper when SCRAPER_API_KEY is set to bypass the
  // Cloudflare/JS challenge on datacenter IPs).
  {
    name: 'Igihe',
    url: 'https://igihe.com/spip.php?page=backend',
    language: 'rw',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // Umuseke — WordPress feed (real pubDate + content:encoded + categories).
  {
    name: 'Umuseke',
    url: 'https://umuseke.rw/feed/',
    language: 'rw',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // Imvaho Nshya — WordPress feed.
  {
    name: 'Imvaho Nshya',
    url: 'https://imvahonshya.co.rw/feed/',
    language: 'rw',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // Umuryango — SPIP backend feed (the WordPress-style /feed/ path 404s here).
  {
    name: 'Umuryango',
    url: 'https://umuryango.rw/spip.php?page=backend',
    language: 'rw',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // Intyoza — WordPress feed (content:encoded). Regional RW news; publishes a
  // few times a week rather than daily, but adds real Kinyarwanda coverage.
  {
    name: 'Intyoza',
    url: 'https://intyoza.com/feed/',
    language: 'rw',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // Rushyashya — WordPress feed of the Kinyarwanda newspaper (actively updated,
  // real pubDate + content:encoded). Added to widen RW volume after Igihe's
  // SPIP backend went dark (see the Igihe note above).
  {
    name: 'Rushyashya',
    url: 'https://rushyashya.net/feed/',
    language: 'rw',
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
