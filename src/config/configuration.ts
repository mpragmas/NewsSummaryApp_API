export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    ttl: parseInt(process.env.REDIS_TTL ?? '1800', 10),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY ?? '',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'changeme-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  oauth: {
    google: {
      /** Comma-separated Google OAuth client IDs (Web, iOS, Android). */
      clientIds: (process.env.GOOGLE_CLIENT_IDS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    },
    apple: {
      /** Comma-separated Services IDs / bundle IDs that appear as `aud` in the Apple ID token. */
      clientIds: (process.env.APPLE_CLIENT_IDS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID ?? '',
      appSecret: process.env.FACEBOOK_APP_SECRET ?? '',
    },
  },
});
