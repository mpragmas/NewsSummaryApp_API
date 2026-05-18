import type { ConfigService } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';

/**
 * Accepts a plain `rediss://…` URL or a pasted Upstash `redis-cli --tls -u rediss://…` line.
 */
export function normalizeRedisUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;

  let url = raw.trim().replace(/^["']|["']$/g, '');

  const embedded = url.match(/(rediss?:\/\/[^\s'"]+)/i);
  if (embedded) url = embedded[1];

  if (!/^rediss?:\/\//i.test(url)) return undefined;

  // Upstash requires TLS
  if (url.startsWith('redis://') && /\.upstash\.io/i.test(url)) {
    url = `rediss://${url.slice('redis://'.length)}`;
  }

  return url;
}

function resolveRedisUrl(config: ConfigService): string | undefined {
  return (
    normalizeRedisUrl(process.env.REDIS_URL) ??
    normalizeRedisUrl(config.get<string>('redis.url'))
  );
}

/** BullMQ / ioredis connection (supports Upstash `rediss://` URLs). */
export function getRedisConnectionOptions(
  config: ConfigService,
): RedisOptions & { maxRetriesPerRequest: null } {
  const url = resolveRedisUrl(config);
  if (url) {
    const parsed = new URL(url);
    const useTls = parsed.protocol === 'rediss:';
    const username =
      parsed.username && parsed.username !== 'default'
        ? decodeURIComponent(parsed.username)
        : undefined;
    const password = parsed.password
      ? decodeURIComponent(parsed.password)
      : undefined;

    return {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 6379,
      username,
      password,
      db: parseInt(parsed.searchParams.get('db') ?? '0', 10),
      ...(useTls ? { tls: {} } : {}),
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: config.get<string>('redis.host') ?? 'localhost',
    port: config.get<number>('redis.port') ?? 6379,
    password: config.get<string>('redis.password'),
    db: config.get<number>('redis.db') ?? 0,
    maxRetriesPerRequest: null,
  };
}

/** Keyv / cache-manager Redis URI (host:port or full `redis(s)://` URL). */
export function getRedisKeyvUri(config: ConfigService): string {
  const url = resolveRedisUrl(config);
  if (url) return url;

  const host = config.get<string>('redis.host') ?? 'localhost';
  const port = config.get<number>('redis.port') ?? 6379;
  const password = config.get<string>('redis.password');
  if (password) {
    return `redis://:${encodeURIComponent(password)}@${host}:${port}`;
  }
  return `redis://${host}:${port}`;
}

/** Log-friendly target for startup diagnostics (no secrets). */
export function describeRedisTarget(config: ConfigService): string {
  const url = resolveRedisUrl(config);
  if (url) {
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.hostname}:${parsed.port || 6379}`;
    } catch {
      return 'REDIS_URL (invalid — fix .env)';
    }
  }
  const host = config.get<string>('redis.host') ?? 'localhost';
  const port = config.get<number>('redis.port') ?? 6379;
  return `redis://${host}:${port} (local — start Docker Redis or set REDIS_URL)`;
}
