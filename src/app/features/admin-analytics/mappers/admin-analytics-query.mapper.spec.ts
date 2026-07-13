/** Bu dosya, admin analytics tarih/limit query yardımcılarının backend sınırlarını doğrular. */
import { describe, expect, it } from 'vitest';
import { createAdminDateRangeQuery, createAdminListQuery } from './admin-analytics-query.mapper';

describe('admin analytics query mapper', () => {
  /** Gün aralığını deterministic ISO UTC query alanlarına dönüştürür. */
  it('creates a UTC date range', () => {
    const query = createAdminDateRangeQuery(7, new Date('2026-07-13T12:00:00.000Z'));
    expect(query).toEqual({
      fromUtc: '2026-07-06T12:00:00.000Z',
      toUtc: '2026-07-13T12:00:00.000Z',
    });
  });

  /** Liste limitini Swagger maksimum değeri olan 100 içinde tutar. */
  it('clamps list limit', () => {
    const query = createAdminListQuery(30, 500, new Date('2026-07-13T12:00:00.000Z'));
    expect(query.limit).toBe(100);
  });
});
