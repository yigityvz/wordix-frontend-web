/** Bu dosya, admin analytics DTO'larını state için null olmayan collection modellere dönüştürür. */
import { AdminDashboardAnalyticsResponseDto, MostWrongLearningItemsAnalyticsResponseDto, ProviderStatsAnalyticsResponseDto, TopSavedLearningItemsAnalyticsResponseDto, TopSearchesAnalyticsResponseDto } from '../models/admin-analytics-api.models';
import { AdminDashboardAnalytics, MostWrongAnalytics, ProviderStatsAnalytics, TopSavedAnalytics, TopSearchesAnalytics } from '../models/admin-analytics.models';
/** Scalar dashboard değerlerini frontend hesabı eklemeden taşır. */ export function mapAdminDashboard(dto:AdminDashboardAnalyticsResponseDto):AdminDashboardAnalytics{return{...dto};}
/** Nullable top searches listesini boş diziye normalize eder. */ export function mapTopSearches(dto:TopSearchesAnalyticsResponseDto):TopSearchesAnalytics{return{...dto,items:dto.items??[]};}
/** Nullable top saved listesini boş diziye normalize eder. */ export function mapTopSaved(dto:TopSavedLearningItemsAnalyticsResponseDto):TopSavedAnalytics{return{...dto,items:dto.items??[]};}
/** Nullable most wrong listesini boş diziye normalize eder. */ export function mapMostWrong(dto:MostWrongLearningItemsAnalyticsResponseDto):MostWrongAnalytics{return{...dto,items:dto.items??[]};}
/** Nullable provider stats listesini boş diziye normalize eder. */ export function mapProviderStats(dto:ProviderStatsAnalyticsResponseDto):ProviderStatsAnalytics{return{...dto,items:dto.items??[]};}
