import type { Request } from 'express';
import { DeviceType } from '../generated/prisma';

/**
 * Privacy-preserving request context extraction.
 *
 * We deliberately never persist IP addresses or raw User-Agent strings. Instead
 * the IP is reduced to a coarse country/region (read from the CDN edge headers
 * that Render / Vercel / Cloudflare inject) and the UA to a device class. This
 * keeps the analytics pipeline GDPR-friendly while still answering the partner
 * questions ("which countries / devices is our traffic coming from?").
 */
export interface RequestContext {
  country?: string;
  region?: string;
  device: DeviceType;
  referrer?: string;
  userAgent?: string;
}

function firstHeader(req: Request, name: string): string | undefined {
  const v = req.headers[name];
  const value = Array.isArray(v) ? v[0] : v;
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Coarse device classification from the User-Agent. No fingerprinting. */
export function classifyDevice(ua?: string): DeviceType {
  if (!ua) return DeviceType.unknown;
  const s = ua.toLowerCase();
  if (
    /(bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headless)/.test(
      s,
    )
  ) {
    return DeviceType.bot;
  }
  if (/(ipad|tablet|playbook|silk|kindle)/.test(s)) return DeviceType.tablet;
  if (
    /(android(?!.*mobile)|tablet)/.test(s) &&
    !/mobile/.test(s)
  ) {
    return DeviceType.tablet;
  }
  if (/(mobi|iphone|ipod|android.*mobile|windows phone|blackberry)/.test(s)) {
    return DeviceType.mobile;
  }
  return DeviceType.desktop;
}

/** Best-effort ISO country from common CDN / proxy edge headers. */
function inferCountry(req: Request): string | undefined {
  return (
    firstHeader(req, 'cf-ipcountry') ??
    firstHeader(req, 'x-vercel-ip-country') ??
    firstHeader(req, 'x-render-ip-country') ??
    firstHeader(req, 'x-appengine-country') ??
    firstHeader(req, 'x-country-code')
  )?.toUpperCase();
}

function inferRegion(req: Request): string | undefined {
  return (
    firstHeader(req, 'x-vercel-ip-country-region') ??
    firstHeader(req, 'x-appengine-region') ??
    firstHeader(req, 'x-region')
  );
}

/** Truncate the referrer to its origin — we never need the full path/query. */
function normalizeReferrer(raw?: string): string | undefined {
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return u.host || undefined;
  } catch {
    // Not a URL (e.g. "android-app://...") — keep a short, bounded slice.
    return raw.slice(0, 120);
  }
}

export function getRequestContext(req: Request): RequestContext {
  const userAgent = firstHeader(req, 'user-agent');
  const referrer =
    normalizeReferrer(firstHeader(req, 'referer')) ??
    normalizeReferrer(firstHeader(req, 'referrer'));

  return {
    country: inferCountry(req),
    region: inferRegion(req),
    device: classifyDevice(userAgent),
    referrer,
    // Stored only on UserSession (bounded length) for debugging device mix.
    userAgent: userAgent?.slice(0, 255),
  };
}
