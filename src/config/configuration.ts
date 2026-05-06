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
    /** Optional auth — leave blank for local Redis without password. */
    password: process.env.REDIS_PASSWORD ?? undefined,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY ?? '',
  },
  /** Per-provider rate limits — tuned for the published free-tier ceilings. */
  rateLimit: {
    groqRpm: parseInt(process.env.GROQ_RPM ?? '25', 10),
    groqTpm: parseInt(process.env.GROQ_TPM ?? '5500', 10),
    geminiRpm: parseInt(process.env.GEMINI_RPM ?? '12', 10),
    geminiTpm: parseInt(process.env.GEMINI_TPM ?? '800000', 10),
  },
  /** Queue + worker tuning. */
  queue: {
    summarizationConcurrency: parseInt(
      process.env.SUMMARIZATION_CONCURRENCY ?? '2',
      10,
    ),
    summarizationAttempts: parseInt(
      process.env.SUMMARIZATION_ATTEMPTS ?? '5',
      10,
    ),
    summarizationBackoffMs: parseInt(
      process.env.SUMMARIZATION_BACKOFF_MS ?? '4000',
      10,
    ),
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'changeme-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT ?? '',
  },
  reviews: {
    reviewDetails: process.env.REVIEW_DETAILS_ENABLED === 'true',
  },
  admin: {
    apiKey: (process.env.ADMIN_API_KEY ?? '').trim(),
  },
});
