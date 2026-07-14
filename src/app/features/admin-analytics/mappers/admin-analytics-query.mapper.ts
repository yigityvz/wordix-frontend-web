/** Bu dosya, admin analytics tarih aralığı querylerini tutarlı ISO UTC değerleriyle üretir. */
import {
  AdminAnalyticsDateRangeQuery,
  AdminAnalyticsListQuery,
} from '../models/admin-analytics-query.models';

/** Bugünden geriye verilen gün sayısını kapsayan backend destekli tarih querysini üretir. */
export function createAdminDateRangeQuery(
  days: number,
  now: Date = new Date(),
): AdminAnalyticsDateRangeQuery {
  const safeDays = Math.max(1, days);
  const from = new Date(now.getTime() - safeDays * 86_400_000);
  return { fromUtc: from.toISOString(), toUtc: now.toISOString() };
}

/** Tarih aralığına backend sınırını aşmayan liste limitini ekler. */
export function createAdminListQuery(
  days: number,
  limit = 20,
  now: Date = new Date(),
): AdminAnalyticsListQuery {
  return { ...createAdminDateRangeQuery(days, now), limit: Math.min(100, Math.max(1, limit)) };
}
