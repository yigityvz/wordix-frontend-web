/** Bu dosya, canlı Swagger'daki user-statistics query parametrelerini typesafe tanımlar. */
export interface QuizStatisticsQuery {
  readonly fromUtc?: string;
  readonly toUtc?: string;
  readonly quizType?: string;
  readonly quizSourceType?: string;
  readonly quizContentMode?: string;
  readonly difficultyGroup?: string;
}

/** Difficult-items endpointinin backend-supported source değerleridir. */
export type DifficultItemSource = 'both' | 'manual' | 'progress';
/** Difficult-items endpointinin backend-supported sıralama değerleridir. */
export type DifficultItemSort = 'confidenceAsc' | 'wrongCountDesc' | 'consecutiveWrongDesc' | 'nextReviewAsc' | 'savedAtDesc';

/** Sayfalı difficult-items endpointinin canonical query parametreleridir. */
export interface DifficultItemsQuery {
  readonly pageNumber?: number;
  readonly pageSize?: number;
  readonly source?: DifficultItemSource;
  readonly sortBy?: DifficultItemSort;
  readonly itemType?: string;
  readonly learningStatus?: string;
}
