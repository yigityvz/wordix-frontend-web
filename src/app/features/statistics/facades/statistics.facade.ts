/** Bu dosya, statistics page ve componentlerine NgRx ayrıntısı göstermeden state ve intent sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DifficultItemsQuery, QuizStatisticsQuery } from '../models/statistics-query.models';
import { StatisticsActions } from '../store/statistics.actions';
import * as StatisticsSelectors from '../store/statistics.selectors';

/** User-statistics feature için tek component-state/action köprüsüdür. */
@Injectable()
export class StatisticsFacade {
  /** Statistics feature selector ve action erişimini sağlar. */
  private readonly store=inject(Store);
  readonly learningSummaryStatus=this.store.selectSignal(StatisticsSelectors.selectLearningSummaryStatus);
  readonly learningSummary=this.store.selectSignal(StatisticsSelectors.selectLearningSummary);
  readonly learningSummaryError=this.store.selectSignal(StatisticsSelectors.selectLearningSummaryError);
  readonly quizStatisticsStatus=this.store.selectSignal(StatisticsSelectors.selectQuizStatisticsStatus);
  readonly quizStatistics=this.store.selectSignal(StatisticsSelectors.selectQuizStatistics);
  readonly quizStatisticsQuery=this.store.selectSignal(StatisticsSelectors.selectQuizStatisticsQuery);
  readonly quizStatisticsError=this.store.selectSignal(StatisticsSelectors.selectQuizStatisticsError);
  readonly difficultItemsStatus=this.store.selectSignal(StatisticsSelectors.selectDifficultItemsStatus);
  readonly difficultItems=this.store.selectSignal(StatisticsSelectors.selectDifficultItems);
  readonly difficultItemsQuery=this.store.selectSignal(StatisticsSelectors.selectDifficultItemsQuery);
  readonly difficultItemsError=this.store.selectSignal(StatisticsSelectors.selectDifficultItemsError);
  readonly deckStatisticsStatus=this.store.selectSignal(StatisticsSelectors.selectDeckStatisticsStatus);
  readonly deckStatistics=this.store.selectSignal(StatisticsSelectors.selectDeckStatistics);
  readonly deckStatisticsError=this.store.selectSignal(StatisticsSelectors.selectDeckStatisticsError);
  readonly confidenceDistributionStatus=this.store.selectSignal(StatisticsSelectors.selectConfidenceDistributionStatus);
  readonly confidenceDistribution=this.store.selectSignal(StatisticsSelectors.selectConfidenceDistribution);
  readonly confidenceDistributionError=this.store.selectSignal(StatisticsSelectors.selectConfidenceDistributionError);
  readonly isAnyLoading=this.store.selectSignal(StatisticsSelectors.selectIsAnyStatisticsLoading);
  /** Learning summary endpoint intentini gönderir. */
  loadLearningSummary():void{this.store.dispatch(StatisticsActions.loadLearningSummary());}
  /** Quiz statistics endpoint intentini filtrelerle gönderir. */
  loadQuizStatistics(query:QuizStatisticsQuery={}):void{this.store.dispatch(StatisticsActions.loadQuizStatistics({query}));}
  /** Difficult-items endpoint intentini canonical default paginationla gönderir. */
  loadDifficultItems(query:DifficultItemsQuery={pageNumber:1,pageSize:20,source:'both',sortBy:'confidenceAsc'}):void{this.store.dispatch(StatisticsActions.loadDifficultItems({query}));}
  /** Deck statistics endpoint intentini gönderir. */
  loadDeckStatistics():void{this.store.dispatch(StatisticsActions.loadDeckStatistics());}
  /** Confidence distribution endpoint intentini gönderir. */
  loadConfidenceDistribution():void{this.store.dispatch(StatisticsActions.loadConfidenceDistribution());}
  /** Feature teardown için bütün statistics state'ini temizler. */
  clear():void{this.store.dispatch(StatisticsActions.clear());}
}
