import { spawn } from 'node:child_process';
import { Logger } from '@nestjs/common';

const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NewsSummary/1.0';

export interface FetchHtmlOptions {
  timeoutMs?: number;
  maxRetries?: number;
  /** Override the User-Agent used for both fetch and curl. */
  userAgent?: string;
  /** Extra headers (forwarded to both fetch and curl). */
  extraHeaders?: Record<string, string>;
  /**
   * Re-issue the request via curl when the response body contains this marker
   * even with a 200/403 (e.g. Cloudflare "Just a moment..." pages). Node's
   * fetch uses a TLS handshake that some Cloudflare sites flag as bot traffic;
   * the system `curl` binary on Linux/macOS does not, and we can reuse it
   * without adding a heavyweight npm dependency.
   */
  curlFallback?: boolean;
  /** Skip Node fetch and use curl immediately (for Cloudflare-only sites). */
  preferCurl?: boolean;
}

const CLOUDFLARE_MARKERS = ['Just a moment', 'cf_chl_opt', '__cf_chl_'];
const CURL_TIMEOUT_BUFFER_MS = 5_000;

function isCloudflareChallenge(body: string): boolean {
  return CLOUDFLARE_MARKERS.some((m) => body.includes(m));
}

async function nativeFetch(
  url: string,
  options: Required<Pick<FetchHtmlOptions, 'timeoutMs' | 'userAgent'>> &
    Pick<FetchHtmlOptions, 'extraHeaders'>,
): Promise<{ status: number; body: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': options.userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'rw,en;q=0.9,fr;q=0.8',
        ...(options.extraHeaders ?? {}),
      },
    });
    const body = await res.text();
    return { status: res.status, body };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function curlFetch(
  url: string,
  options: Required<Pick<FetchHtmlOptions, 'timeoutMs' | 'userAgent'>> &
    Pick<FetchHtmlOptions, 'extraHeaders'>,
): Promise<{ status: number; body: string } | null> {
  const sentinel = '\n___HTTP_STATUS___';
  const timeoutSec = Math.max(
    5,
    Math.ceil((options.timeoutMs + CURL_TIMEOUT_BUFFER_MS) / 1000),
  );
  const args: string[] = [
    '-sS',
    '-L',
    '--max-time',
    String(timeoutSec),
    '-A',
    options.userAgent,
  ];
  for (const [k, v] of Object.entries(options.extraHeaders ?? {})) {
    args.push('-H', `${k}: ${v}`);
  }
  args.push('--write-out', `${sentinel}%{http_code}`, url);

  return new Promise((resolve) => {
    const child = spawn('curl', args, {
      windowsHide: true,
      // Avoid shell quoting problems entirely.
      shell: false,
    });

    let stdout = '';
    let stderr = '';
    let killed = false;
    const killTimer = setTimeout(() => {
      killed = true;
      child.kill();
    }, options.timeoutMs + CURL_TIMEOUT_BUFFER_MS + 2_000);

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    child.on('error', () => {
      clearTimeout(killTimer);
      resolve(null);
    });
    child.on('close', (code) => {
      clearTimeout(killTimer);
      if (killed) {
        resolve(null);
        return;
      }
      if (code !== 0 && stdout.length === 0) {
        resolve(null);
        return;
      }
      const idx = stdout.lastIndexOf(sentinel);
      if (idx < 0) {
        if (stderr) void stderr; // available for future logging
        resolve({ status: 0, body: stdout });
        return;
      }
      const body = stdout.slice(0, idx);
      const statusStr = stdout.slice(idx + sentinel.length).trim();
      resolve({ status: Number.parseInt(statusStr, 10) || 0, body });
    });
  });
}

/**
 * Resilient HTML fetcher with optional curl fallback for Cloudflare-protected
 * pages (e.g. kigalitoday.com).
 */
export async function fetchHtml(
  url: string,
  source: string,
  logger: Logger,
  opts: FetchHtmlOptions = {},
): Promise<string | null> {
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const maxRetries = opts.maxRetries ?? 2;
  const userAgent = opts.userAgent ?? DEFAULT_UA;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (opts.preferCurl && opts.curlFallback) {
      const viaCurl = await curlFetch(url, {
        timeoutMs,
        userAgent,
        extraHeaders: opts.extraHeaders,
      });
      if (viaCurl && viaCurl.status >= 200 && viaCurl.status < 300) {
        if (!isCloudflareChallenge(viaCurl.body)) {
          logger.debug?.(`${source}: fetched via curl (status=${viaCurl.status})`);
          return viaCurl.body;
        }
      }
      logger.warn(
        `${source} curl attempt ${attempt}/${maxRetries} failed (status=${viaCurl?.status ?? 'n/a'}, url=${url})`,
      );
      if (attempt === maxRetries) return null;
      await new Promise((r) => setTimeout(r, 750 * attempt));
      continue;
    }

    const fetched = await nativeFetch(url, {
      timeoutMs,
      userAgent,
      extraHeaders: opts.extraHeaders,
    });
    const blockedByCf =
      fetched != null &&
      (fetched.status === 403 || fetched.status === 503) &&
      isCloudflareChallenge(fetched.body);

    if (fetched && fetched.status >= 200 && fetched.status < 300 && !blockedByCf) {
      return fetched.body;
    }

    if ((blockedByCf || fetched?.status === 403) && opts.curlFallback) {
      const viaCurl = await curlFetch(url, {
        timeoutMs,
        userAgent,
        extraHeaders: opts.extraHeaders,
      });
      if (viaCurl && viaCurl.status >= 200 && viaCurl.status < 300) {
        logger.debug?.(`${source}: served via curl fallback (status=${viaCurl.status})`);
        return viaCurl.body;
      }
      logger.warn(
        `${source}: curl fallback failed (status=${viaCurl?.status ?? 'n/a'}, url=${url})`,
      );
    } else if (fetched) {
      logger.warn(
        `${source} fetch attempt ${attempt}/${maxRetries} failed: HTTP ${fetched.status} (${url})`,
      );
    } else {
      logger.warn(
        `${source} fetch attempt ${attempt}/${maxRetries} failed (network/timeout) (${url})`,
      );
    }

    if (attempt === maxRetries) return null;
    await new Promise((r) => setTimeout(r, 750 * attempt));
  }
  return null;
}
