/** Bu dosya, statistics mapperlarının nullable backend collectionlarını normalize ettiğini doğrular. */
import { describe,expect,it } from 'vitest';
import { ConfidenceScoreDistributionResponseDto, DeckStatisticsResponseDto, DifficultLearningItemsPagedResponseDto } from '../models/statistics-api.models';
import { mapConfidenceDistribution,mapDeckStatistics,mapDifficultItems } from './statistics.mapper';
describe('statistics mappers',()=>{
  /** Difficult items null listesini state için boş diziye dönüştürür. */
  it('normalizes difficult items',()=>{const dto={items:null,pageNumber:1,pageSize:20,totalCount:0,totalPages:0,hasPreviousPage:false,hasNextPage:false} as DifficultLearningItemsPagedResponseDto;expect(mapDifficultItems(dto).items).toEqual([]);});
  /** Deck null listesini state için boş diziye dönüştürür. */
  it('normalizes deck statistics',()=>{const dto={totalDeckCount:0,activeDeckCount:0,generatedAt:'2026-01-01',items:null} as DeckStatisticsResponseDto;expect(mapDeckStatistics(dto).items).toEqual([]);});
  /** Confidence null bucket listesini state için boş diziye dönüştürür. */
  it('normalizes confidence buckets',()=>{const dto={totalItemCount:0,averageConfidenceScore:0,generatedAt:'2026-01-01',buckets:null} as ConfidenceScoreDistributionResponseDto;expect(mapConfidenceDistribution(dto).buckets).toEqual([]);});
});
