/** Bu dosya, statistics state ve UI katmanının normalize salt-okunur modellerini tanımlar. */
import { PagedResult } from '@core/http/models/paged-result.model';
import {
  ConfidenceScoreBucketResponseDto,
  ConfidenceScoreDistributionResponseDto,
  DeckStatisticsItemResponseDto,
  DeckStatisticsResponseDto,
  DifficultLearningItemResponseDto,
  QuizStatisticsResponseDto,
  UserLearningSummaryResponseDto,
} from './statistics-api.models';

/** Scalar learning summary sözleşmesi Swagger DTO'suyla aynı alanları korur. */
export type UserLearningSummary = UserLearningSummaryResponseDto;
/** Scalar quiz statistics sözleşmesi Swagger DTO'suyla aynı alanları korur. */
export type QuizStatistics = QuizStatisticsResponseDto;
/** Tek difficult item modeli backend alanlarını korur. */
export type DifficultLearningItem = DifficultLearningItemResponseDto;
/** Difficult item pagination modeli merkezi paged contractı kullanır. */
export interface DifficultLearningItemsPage extends Omit<
  PagedResult<DifficultLearningItem>,
  'items'
> {
  readonly items: readonly DifficultLearningItem[];
}
/** Tek deck statistics modeli backend alanlarını korur. */
export type DeckStatisticsItem = DeckStatisticsItemResponseDto;
/** Normalize deck statistics collection modelidir. */
export interface DeckStatistics extends Omit<DeckStatisticsResponseDto, 'items'> {
  readonly items: readonly DeckStatisticsItem[];
}
/** Tek confidence bucket modeli backend alanlarını korur. */
export type ConfidenceScoreBucket = ConfidenceScoreBucketResponseDto;
/** Normalize confidence distribution modelidir. */
export interface ConfidenceScoreDistribution extends Omit<
  ConfidenceScoreDistributionResponseDto,
  'buckets'
> {
  readonly buckets: readonly ConfidenceScoreBucket[];
}
