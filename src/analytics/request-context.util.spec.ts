import type { Request } from 'express';
import { DeviceType } from '../generated/prisma';
import { classifyDevice, getRequestContext } from './request-context.util';

describe('request-context.util', () => {
  describe('classifyDevice', () => {
    it('returns unknown when UA is absent', () => {
      expect(classifyDevice(undefined)).toBe(DeviceType.unknown);
    });

    it('detects mobile', () => {
      expect(
        classifyDevice(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148',
        ),
      ).toBe(DeviceType.mobile);
    });

    it('detects tablets (iPad)', () => {
      expect(
        classifyDevice('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)'),
      ).toBe(DeviceType.tablet);
    });

    it('detects desktop', () => {
      expect(
        classifyDevice(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ),
      ).toBe(DeviceType.desktop);
    });

    it('detects bots/crawlers', () => {
      expect(classifyDevice('Googlebot/2.1 (+http://www.google.com/bot.html)')).toBe(
        DeviceType.bot,
      );
    });
  });

  describe('getRequestContext', () => {
    function makeReq(headers: Record<string, string>): Request {
      return { headers } as unknown as Request;
    }

    it('reads country from CDN edge headers and uppercases it', () => {
      const ctx = getRequestContext(makeReq({ 'cf-ipcountry': 'rw' }));
      expect(ctx.country).toBe('RW');
    });

    it('reduces referrer to its host only (no path/query — privacy)', () => {
      const ctx = getRequestContext(
        makeReq({ referer: 'https://news.example.com/some/article?utm=1' }),
      );
      expect(ctx.referrer).toBe('news.example.com');
    });

    it('never throws and defaults device to unknown on empty headers', () => {
      const ctx = getRequestContext(makeReq({}));
      expect(ctx.device).toBe(DeviceType.unknown);
      expect(ctx.country).toBeUndefined();
    });
  });
});
