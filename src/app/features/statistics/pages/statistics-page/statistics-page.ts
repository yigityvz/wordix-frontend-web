/** Bu dosya, beş gerçek user-statistics state akışını tek responsive route ekranında birleştirir. */
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '@shared/components/card/card';
import { ErrorState } from '@shared/components/error-state/error-state';
import { Spinner } from '@shared/components/spinner/spinner';
import { ConfidenceDistributionChart } from '../../components/confidence-distribution-chart/confidence-distribution-chart';
import { DeckStatisticsGrid } from '../../components/deck-statistics-grid/deck-statistics-grid';
import { DifficultItemsTable } from '../../components/difficult-items-table/difficult-items-table';
import { LearningSummaryCards } from '../../components/learning-summary-cards/learning-summary-cards';
import { QuizStatisticsPanel } from '../../components/quiz-statistics-panel/quiz-statistics-panel';
import { StatisticsFacade } from '../../facades/statistics.facade';
import { DifficultItemsQuery, DifficultItemSort, DifficultItemSource } from '../../models/statistics-query.models';

/** Statistics filtrelerini gerçek facade intentleriyle yöneten protected user sayfasıdır. */
@Component({selector:'wx-statistics-page',imports:[Card,ConfidenceDistributionChart,DeckStatisticsGrid,DifficultItemsTable,ErrorState,LearningSummaryCards,QuizStatisticsPanel,RouterLink,Spinner],templateUrl:'./statistics-page.html',changeDetection:ChangeDetectionStrategy.OnPush})
export class StatisticsPage implements OnInit,OnDestroy {
  /** Bütün statistics state ve intentlerini tek facade üzerinden yönetir. */ private readonly facade=inject(StatisticsFacade);
  /** Quiz statistics tarih aralığını gün cinsinden tutar. */ protected readonly dateRangeDays=signal(30);
  /** Backend-supported nullable quiz type filtresini tutar. */ protected readonly quizType=signal<string|null>(null);
  /** Difficult-items pagination ve filtre state'ini canonical defaultlarla tutar. */ protected readonly difficultQuery=signal<DifficultItemsQuery>({pageNumber:1,pageSize:20,source:'both',sortBy:'confidenceAsc'});
  protected readonly learningSummaryStatus=this.facade.learningSummaryStatus; protected readonly learningSummary=this.facade.learningSummary; protected readonly learningSummaryError=this.facade.learningSummaryError;
  protected readonly quizStatisticsStatus=this.facade.quizStatisticsStatus; protected readonly quizStatistics=this.facade.quizStatistics; protected readonly quizStatisticsError=this.facade.quizStatisticsError;
  protected readonly difficultItemsStatus=this.facade.difficultItemsStatus; protected readonly difficultItems=this.facade.difficultItems; protected readonly difficultItemsError=this.facade.difficultItemsError;
  protected readonly deckStatisticsStatus=this.facade.deckStatisticsStatus; protected readonly deckStatistics=this.facade.deckStatistics; protected readonly deckStatisticsError=this.facade.deckStatisticsError;
  protected readonly confidenceStatus=this.facade.confidenceDistributionStatus; protected readonly confidenceDistribution=this.facade.confidenceDistribution; protected readonly confidenceError=this.facade.confidenceDistributionError;

  /** Route açılışında beş gerçek statistics read isteğini başlatır. */ ngOnInit():void{this.loadLearningSummary();this.loadQuizStatistics();this.loadDifficultItems();this.loadDeckStatistics();this.loadConfidenceDistribution();}
  /** Route kapanırken statistics state'inin başka kullanıcı ekranına sızmasını engeller. */ ngOnDestroy():void{this.facade.clear();}
  /** Learning summary endpointini ilk yükleme ve retry için çağırır. */ protected loadLearningSummary():void{this.facade.loadLearningSummary();}
  /** Seçili tarih/type filtreleriyle gerçek quiz statistics isteği gönderir. */ protected loadQuizStatistics():void{const to=new Date();const from=new Date(to.getTime()-this.dateRangeDays()*86_400_000);this.facade.loadQuizStatistics({fromUtc:from.toISOString(),toUtc:to.toISOString(),quizType:this.quizType()??undefined});}
  /** Seçilen tarih aralığını kaydedip quiz statistics endpointini yeniden çağırır. */ protected selectDateRange(days:number):void{this.dateRangeDays.set(days);this.loadQuizStatistics();}
  /** Seçilen quiz tipini kaydedip gerçek filtreli endpointi yeniden çağırır. */ protected selectQuizType(type:string|null):void{this.quizType.set(type);this.loadQuizStatistics();}
  /** Mevcut difficult query ile gerçek sayfalı endpointi çağırır. */ protected loadDifficultItems():void{this.facade.loadDifficultItems(this.difficultQuery());}
  /** Sayfa numarasını güvenli alt sınırla güncelleyip endpointi yeniden çağırır. */ protected changeDifficultPage(pageNumber:number):void{this.difficultQuery.update(query=>({...query,pageNumber:Math.max(1,pageNumber)}));this.loadDifficultItems();}
  /** Source filtresini değiştirip paginationı ilk sayfaya döndürür. */ protected changeDifficultSource(source:DifficultItemSource):void{this.difficultQuery.update(query=>({...query,source,pageNumber:1}));this.loadDifficultItems();}
  /** Sort filtresini değiştirip paginationı ilk sayfaya döndürür. */ protected changeDifficultSort(sortBy:DifficultItemSort):void{this.difficultQuery.update(query=>({...query,sortBy,pageNumber:1}));this.loadDifficultItems();}
  /** Deck statistics endpointini ilk yükleme ve retry için çağırır. */ protected loadDeckStatistics():void{this.facade.loadDeckStatistics();}
  /** Confidence distribution endpointini ilk yükleme ve retry için çağırır. */ protected loadConfidenceDistribution():void{this.facade.loadConfidenceDistribution();}
}
