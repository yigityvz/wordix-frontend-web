/** Bu dosya, statistics actionlarını immutable endpoint state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';
import { StatisticsActions } from './statistics.actions';
import { initialStatisticsState } from './statistics.state';

/** Beş read lifecycle'ını birbirini silmeden yöneten saf reduc erdır. */
export const statisticsReducer = createReducer(
  initialStatisticsState,
  on(StatisticsActions.loadLearningSummary, (s) => ({
    ...s,
    learningSummaryStatus: 'loading' as const,
    learningSummaryError: null,
  })),
  on(StatisticsActions.loadLearningSummarySuccess, (s, { summary }) => ({
    ...s,
    learningSummaryStatus: 'loaded' as const,
    learningSummary: summary,
    learningSummaryError: null,
  })),
  on(StatisticsActions.loadLearningSummaryFailure, (s, { message }) => ({
    ...s,
    learningSummaryStatus: 'error' as const,
    learningSummaryError: message,
  })),
  on(StatisticsActions.loadQuizStatistics, (s, { query }) => ({
    ...s,
    quizStatisticsStatus: 'loading' as const,
    quizStatisticsQuery: query,
    quizStatisticsError: null,
  })),
  on(StatisticsActions.loadQuizStatisticsSuccess, (s, { statistics }) => ({
    ...s,
    quizStatisticsStatus: 'loaded' as const,
    quizStatistics: statistics,
    quizStatisticsError: null,
  })),
  on(StatisticsActions.loadQuizStatisticsFailure, (s, { message }) => ({
    ...s,
    quizStatisticsStatus: 'error' as const,
    quizStatisticsError: message,
  })),
  on(StatisticsActions.loadDifficultItems, (s, { query }) => ({
    ...s,
    difficultItemsStatus: 'loading' as const,
    difficultItemsQuery: query,
    difficultItemsError: null,
  })),
  on(StatisticsActions.loadDifficultItemsSuccess, (s, { page }) => ({
    ...s,
    difficultItemsStatus: 'loaded' as const,
    difficultItems: page,
    difficultItemsError: null,
  })),
  on(StatisticsActions.loadDifficultItemsFailure, (s, { message }) => ({
    ...s,
    difficultItemsStatus: 'error' as const,
    difficultItemsError: message,
  })),
  on(StatisticsActions.loadDeckStatistics, (s) => ({
    ...s,
    deckStatisticsStatus: 'loading' as const,
    deckStatisticsError: null,
  })),
  on(StatisticsActions.loadDeckStatisticsSuccess, (s, { statistics }) => ({
    ...s,
    deckStatisticsStatus: 'loaded' as const,
    deckStatistics: statistics,
    deckStatisticsError: null,
  })),
  on(StatisticsActions.loadDeckStatisticsFailure, (s, { message }) => ({
    ...s,
    deckStatisticsStatus: 'error' as const,
    deckStatisticsError: message,
  })),
  on(StatisticsActions.loadConfidenceDistribution, (s) => ({
    ...s,
    confidenceDistributionStatus: 'loading' as const,
    confidenceDistributionError: null,
  })),
  on(StatisticsActions.loadConfidenceDistributionSuccess, (s, { distribution }) => ({
    ...s,
    confidenceDistributionStatus: 'loaded' as const,
    confidenceDistribution: distribution,
    confidenceDistributionError: null,
  })),
  on(StatisticsActions.loadConfidenceDistributionFailure, (s, { message }) => ({
    ...s,
    confidenceDistributionStatus: 'error' as const,
    confidenceDistributionError: message,
  })),
  on(StatisticsActions.clear, () => initialStatisticsState),
);
/** Lazy provider tarafından statistics adıyla kaydedilen feature tanımıdır. */
export const statisticsFeature = createFeature({ name: 'statistics', reducer: statisticsReducer });
