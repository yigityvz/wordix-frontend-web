/** Bu dosya, statistics feature state'ini page ve componentler için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';
import { statisticsFeature } from './statistics.reducer';
export const {
  selectLearningSummaryStatus,
  selectLearningSummary,
  selectLearningSummaryError,
  selectQuizStatisticsStatus,
  selectQuizStatistics,
  selectQuizStatisticsQuery,
  selectQuizStatisticsError,
  selectDifficultItemsStatus,
  selectDifficultItems,
  selectDifficultItemsQuery,
  selectDifficultItemsError,
  selectDeckStatisticsStatus,
  selectDeckStatistics,
  selectDeckStatisticsError,
  selectConfidenceDistributionStatus,
  selectConfidenceDistribution,
  selectConfidenceDistributionError,
} = statisticsFeature;
/** Herhangi bir statistics read isteğinin sürüp sürmediğini seçer. */
export const selectIsAnyStatisticsLoading = createSelector(
  selectLearningSummaryStatus,
  selectQuizStatisticsStatus,
  selectDifficultItemsStatus,
  selectDeckStatisticsStatus,
  selectConfidenceDistributionStatus,
  (...statuses) => statuses.includes('loading'),
);
