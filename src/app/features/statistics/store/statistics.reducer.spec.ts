/** Bu dosya, statistics reducer'ın bağımsız read lifecycle geçişlerini doğrular. */
import { describe,expect,it } from 'vitest';
import { UserLearningSummary } from '../models/statistics.models';
import { StatisticsActions } from './statistics.actions';
import { statisticsReducer } from './statistics.reducer';
import { initialStatisticsState } from './statistics.state';
describe('statisticsReducer',()=>{
  /** Difficult query yüklenirken diğer endpoint verisini korur. */
  it('keeps independent state while loading difficult items',()=>{const result=statisticsReducer({...initialStatisticsState,learningSummaryStatus:'loaded',learningSummary:{generatedAt:'x'} as UserLearningSummary},StatisticsActions.loadDifficultItems({query:{pageNumber:2,pageSize:20,source:'manual'}}));expect(result.difficultItemsStatus).toBe('loading');expect(result.difficultItemsQuery.pageNumber).toBe(2);expect(result.learningSummary?.generatedAt).toBe('x');});
  /** Clear actionı feature state'ini canonical başlangıca döndürür. */
  it('clears all statistics state',()=>{expect(statisticsReducer({...initialStatisticsState,deckStatisticsStatus:'error',deckStatisticsError:'x'},StatisticsActions.clear())).toEqual(initialStatisticsState);});
});
