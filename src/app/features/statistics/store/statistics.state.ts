/** Bu dosya, statistics feature'ın beş bağımsız read lifecycle state alanını tanımlar. */
import {
  ConfidenceScoreDistribution,
  DeckStatistics,
  DifficultLearningItemsPage,
  QuizStatistics,
  UserLearningSummary,
} from '../models/statistics.models';
import { DifficultItemsQuery, QuizStatisticsQuery } from '../models/statistics-query.models';
export type StatisticsOperationStatus = 'idle' | 'loading' | 'loaded' | 'error';
export interface StatisticsState {
  readonly learningSummaryStatus: StatisticsOperationStatus;
  readonly learningSummary: UserLearningSummary | null;
  readonly learningSummaryError: string | null;
  readonly quizStatisticsStatus: StatisticsOperationStatus;
  readonly quizStatistics: QuizStatistics | null;
  readonly quizStatisticsQuery: QuizStatisticsQuery;
  readonly quizStatisticsError: string | null;
  readonly difficultItemsStatus: StatisticsOperationStatus;
  readonly difficultItems: DifficultLearningItemsPage | null;
  readonly difficultItemsQuery: DifficultItemsQuery;
  readonly difficultItemsError: string | null;
  readonly deckStatisticsStatus: StatisticsOperationStatus;
  readonly deckStatistics: DeckStatistics | null;
  readonly deckStatisticsError: string | null;
  readonly confidenceDistributionStatus: StatisticsOperationStatus;
  readonly confidenceDistribution: ConfidenceScoreDistribution | null;
  readonly confidenceDistributionError: string | null;
}
export const initialStatisticsState: StatisticsState = {
  learningSummaryStatus: 'idle',
  learningSummary: null,
  learningSummaryError: null,
  quizStatisticsStatus: 'idle',
  quizStatistics: null,
  quizStatisticsQuery: {},
  quizStatisticsError: null,
  difficultItemsStatus: 'idle',
  difficultItems: null,
  difficultItemsQuery: { pageNumber: 1, pageSize: 20, source: 'both', sortBy: 'confidenceAsc' },
  difficultItemsError: null,
  deckStatisticsStatus: 'idle',
  deckStatistics: null,
  deckStatisticsError: null,
  confidenceDistributionStatus: 'idle',
  confidenceDistribution: null,
  confidenceDistributionError: null,
};
