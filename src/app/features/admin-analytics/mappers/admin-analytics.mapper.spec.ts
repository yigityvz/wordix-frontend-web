/** Bu dosya, admin analytics mapperlarının nullable backend collectionlarını normalize ettiğini doğrular. */
import { describe, expect, it } from 'vitest';
import {
  MostWrongLearningItemsAnalyticsResponseDto,
  ProviderStatsAnalyticsResponseDto,
  TopSavedLearningItemsAnalyticsResponseDto,
  TopSearchesAnalyticsResponseDto,
} from '../models/admin-analytics-api.models';
import {
  mapMostWrong,
  mapProviderStats,
  mapTopSaved,
  mapTopSearches,
} from './admin-analytics.mapper';

/** Dört nullable collection mapperının state contractını sınar. */
describe('admin analytics mappers', () => {
  /** Top searches null listesini boş diziye dönüştürür. */
  it('normalizes top searches', () => {
    const dto = { items: null } as TopSearchesAnalyticsResponseDto;
    expect(mapTopSearches(dto).items).toEqual([]);
  });

  /** Top saved null listesini boş diziye dönüştürür. */
  it('normalizes top saved', () => {
    const dto = { items: null } as TopSavedLearningItemsAnalyticsResponseDto;
    expect(mapTopSaved(dto).items).toEqual([]);
  });

  /** Most wrong null listesini boş diziye dönüştürür. */
  it('normalizes most wrong', () => {
    const dto = { items: null } as MostWrongLearningItemsAnalyticsResponseDto;
    expect(mapMostWrong(dto).items).toEqual([]);
  });

  /** Provider stats null listesini boş diziye dönüştürür. */
  it('normalizes provider stats', () => {
    const dto = { items: null } as ProviderStatsAnalyticsResponseDto;
    expect(mapProviderStats(dto).items).toEqual([]);
  });
});
