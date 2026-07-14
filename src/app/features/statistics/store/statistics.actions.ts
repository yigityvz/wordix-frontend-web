/** Bu dosya, user-statistics read lifecycle actionlarını endpoint bazında tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DifficultItemsQuery, QuizStatisticsQuery } from '../models/statistics-query.models';
import {
  ConfidenceScoreDistribution,
  DeckStatistics,
  DifficultLearningItemsPage,
  QuizStatistics,
  UserLearningSummary,
} from '../models/statistics.models';
export const StatisticsActions = createActionGroup({
  source: 'Statistics',
  events: {
    'Load Learning Summary': emptyProps(),
    'Load Learning Summary Success': props<{ readonly summary: UserLearningSummary }>(),
    'Load Learning Summary Failure': props<{ readonly message: string }>(),
    'Load Quiz Statistics': props<{ readonly query: QuizStatisticsQuery }>(),
    'Load Quiz Statistics Success': props<{ readonly statistics: QuizStatistics }>(),
    'Load Quiz Statistics Failure': props<{ readonly message: string }>(),
    'Load Difficult Items': props<{ readonly query: DifficultItemsQuery }>(),
    'Load Difficult Items Success': props<{ readonly page: DifficultLearningItemsPage }>(),
    'Load Difficult Items Failure': props<{ readonly message: string }>(),
    'Load Deck Statistics': emptyProps(),
    'Load Deck Statistics Success': props<{ readonly statistics: DeckStatistics }>(),
    'Load Deck Statistics Failure': props<{ readonly message: string }>(),
    'Load Confidence Distribution': emptyProps(),
    'Load Confidence Distribution Success': props<{
      readonly distribution: ConfidenceScoreDistribution;
    }>(),
    'Load Confidence Distribution Failure': props<{ readonly message: string }>(),
    Clear: emptyProps(),
  },
});
