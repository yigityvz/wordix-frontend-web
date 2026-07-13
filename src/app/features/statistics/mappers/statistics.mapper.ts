/** Bu dosya, statistics transport DTO'larını state için null olmayan collection modellere dönüştürür. */
import { ConfidenceScoreDistributionResponseDto, DeckStatisticsResponseDto, DifficultLearningItemsPagedResponseDto, QuizStatisticsResponseDto, UserLearningSummaryResponseDto } from '../models/statistics-api.models';
import { ConfidenceScoreDistribution, DeckStatistics, DifficultLearningItemsPage, QuizStatistics, UserLearningSummary } from '../models/statistics.models';

/** Scalar learning summary cevabını alanlarını değiştirmeden taşır. */
export function mapLearningSummary(dto: UserLearningSummaryResponseDto): UserLearningSummary { return { ...dto }; }
/** Scalar quiz statistics cevabını frontend hesabı eklemeden taşır. */
export function mapQuizStatistics(dto: QuizStatisticsResponseDto): QuizStatistics { return { ...dto }; }
/** Nullable difficult item listesini boş diziye normalize eder. */
export function mapDifficultItems(dto: DifficultLearningItemsPagedResponseDto): DifficultLearningItemsPage { return { ...dto, items: dto.items ?? [] }; }
/** Nullable deck statistics listesini boş diziye normalize eder. */
export function mapDeckStatistics(dto: DeckStatisticsResponseDto): DeckStatistics { return { ...dto, items: dto.items ?? [] }; }
/** Nullable confidence bucket listesini boş diziye normalize eder. */
export function mapConfidenceDistribution(dto: ConfidenceScoreDistributionResponseDto): ConfidenceScoreDistribution { return { ...dto, buckets: dto.buckets ?? [] }; }
