/** Bu dosya, admin analytics state ve UI katmanının normalize salt-okunur modellerini tanımlar. */
import { AdminDashboardAnalyticsResponseDto, MostWrongLearningItemResponseDto, MostWrongLearningItemsAnalyticsResponseDto, ProviderStatItemResponseDto, ProviderStatsAnalyticsResponseDto, TopSavedLearningItemResponseDto, TopSavedLearningItemsAnalyticsResponseDto, TopSearchedItemResponseDto, TopSearchesAnalyticsResponseDto } from './admin-analytics-api.models';
export type AdminDashboardAnalytics=AdminDashboardAnalyticsResponseDto;
export type TopSearchedItem=TopSearchedItemResponseDto;
export interface TopSearchesAnalytics extends Omit<TopSearchesAnalyticsResponseDto,'items'>{readonly items:readonly TopSearchedItem[];}
export type TopSavedLearningItem=TopSavedLearningItemResponseDto;
export interface TopSavedAnalytics extends Omit<TopSavedLearningItemsAnalyticsResponseDto,'items'>{readonly items:readonly TopSavedLearningItem[];}
export type MostWrongLearningItem=MostWrongLearningItemResponseDto;
export interface MostWrongAnalytics extends Omit<MostWrongLearningItemsAnalyticsResponseDto,'items'>{readonly items:readonly MostWrongLearningItem[];}
export type ProviderStatItem=ProviderStatItemResponseDto;
export interface ProviderStatsAnalytics extends Omit<ProviderStatsAnalyticsResponseDto,'items'>{readonly items:readonly ProviderStatItem[];}
