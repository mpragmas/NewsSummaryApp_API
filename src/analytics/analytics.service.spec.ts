import { AnalyticsEventType, DeviceType } from '../generated/prisma';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RequestContext } from './request-context.util';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repo: jest.Mocked<Pick<
    AnalyticsRepository,
    'bulkInsertEvents' | 'bulkInsertImpressions' | 'bulkInsertClicks' | 'touchSession'
  >>;

  const ctx: RequestContext = {
    country: 'RW',
    device: DeviceType.mobile,
    referrer: 'news.example.com',
  };

  beforeEach(() => {
    repo = {
      bulkInsertEvents: jest.fn().mockResolvedValue({ count: 0 }),
      bulkInsertImpressions: jest.fn().mockResolvedValue({ count: 0 }),
      bulkInsertClicks: jest.fn().mockResolvedValue({ count: 0 }),
      touchSession: jest.fn().mockResolvedValue(undefined),
    };
    service = new AnalyticsService(
      {} as PrismaService,
      repo as unknown as AnalyticsRepository,
    );
  });

  it('buffers events and flushes them in a batch', async () => {
    const res = service.ingestBatch(
      [
        { type: AnalyticsEventType.ARTICLE_OPEN, sessionId: 's1', clusterId: 'c1' },
        { type: AnalyticsEventType.STORY_IMPRESSION, sessionId: 's1', clusterId: 'c2' },
      ],
      { userId: undefined, ctx },
    );
    expect(res.accepted).toBe(2);
    expect(repo.bulkInsertEvents).not.toHaveBeenCalled(); // buffered, not yet flushed

    await service.flush();

    expect(repo.bulkInsertEvents).toHaveBeenCalledTimes(1);
    const events = repo.bulkInsertEvents.mock.calls[0][0];
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      type: AnalyticsEventType.ARTICLE_OPEN,
      sessionId: 's1',
      country: 'RW',
      device: DeviceType.mobile,
      anonymous: true,
    });

    // The impression is mirrored into the dedicated table.
    expect(repo.bulkInsertImpressions).toHaveBeenCalledTimes(1);
    expect(repo.bulkInsertImpressions.mock.calls[0][0]).toHaveLength(1);
  });

  it('marks authenticated events as non-anonymous with a userId', async () => {
    service.ingestBatch(
      [{ type: AnalyticsEventType.SHARE, sessionId: 's2', clusterId: 'c9' }],
      { userId: 'user-1', ctx },
    );
    await service.flush();
    expect(repo.bulkInsertEvents.mock.calls[0][0][0]).toMatchObject({
      userId: 'user-1',
      anonymous: false,
    });
  });

  it('records an external click into both the click + event buffers', async () => {
    service.recordExternalClick({
      articleId: 'a1',
      clusterId: 'c1',
      source: 'Igihe',
      targetUrl: 'https://igihe.com/story',
      sessionId: 's1',
      actor: { userId: undefined, ctx },
    });
    await service.flush();

    expect(repo.bulkInsertClicks).toHaveBeenCalledTimes(1);
    expect(repo.bulkInsertClicks.mock.calls[0][0][0]).toMatchObject({
      articleId: 'a1',
      source: 'Igihe',
      targetUrl: 'https://igihe.com/story',
    });
    const events = repo.bulkInsertEvents.mock.calls[0][0];
    expect(events[0].type).toBe(AnalyticsEventType.EXTERNAL_CLICK);
  });

  it('flush is a no-op when buffers are empty', async () => {
    await service.flush();
    expect(repo.bulkInsertEvents).not.toHaveBeenCalled();
  });

  describe('resolveRange', () => {
    it('defaults to a trailing 30-day window', () => {
      const { from, to } = service.resolveRange({});
      const days = (to.getTime() - from.getTime()) / 86_400_000;
      expect(Math.round(days)).toBe(30);
    });

    it('honours an explicit days window', () => {
      const { from, to } = service.resolveRange({ days: 7 });
      const days = (to.getTime() - from.getTime()) / 86_400_000;
      expect(Math.round(days)).toBe(7);
    });

    it('falls back to a sane range for invalid dates', () => {
      const { from, to } = service.resolveRange({ from: 'not-a-date' });
      expect(from.getTime()).toBeLessThan(to.getTime());
    });
  });
});
