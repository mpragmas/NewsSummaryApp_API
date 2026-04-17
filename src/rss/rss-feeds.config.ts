export interface RssFeedConfig {
  name: string;
  url: string;
  continent: string;
  region: string;
  country: string;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // Global / UK
  {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    continent: 'Europe',
    region: 'Western Europe',
    country: 'United Kingdom',
  },
  {
    name: 'BBC World',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    continent: 'Global',
    region: 'Global',
    country: 'Global',
  },
  // Middle East / Global
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    continent: 'Asia',
    region: 'Middle East',
    country: 'Qatar',
  },
  // Africa
  {
    name: 'AllAfrica',
    url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf',
    continent: 'Africa',
    region: 'Africa',
    country: 'Africa',
  },
  {
    name: 'The East African',
    url: 'https://www.theeastafrican.co.ke/rss',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Kenya',
  },
  // Rwanda
  {
    name: 'The New Times Rwanda',
    url: 'https://www.newtimes.co.rw/rss.xml',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  {
    name: 'KT Press Rwanda',
    url: 'https://ktpress.rw/feed/',
    continent: 'Africa',
    region: 'East Africa',
    country: 'Rwanda',
  },
  // US
  {
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/topNews',
    continent: 'North America',
    region: 'North America',
    country: 'United States',
  },
  // Tech
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    continent: 'North America',
    region: 'North America',
    country: 'United States',
  },
];
