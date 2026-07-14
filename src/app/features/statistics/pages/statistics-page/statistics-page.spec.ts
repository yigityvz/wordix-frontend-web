/** Bu dosya, statistics sayfasının beş gerçek read intentini ve backend-supported filtrelerini doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StatisticsFacade } from '../../facades/statistics.facade';
import { StatisticsPage } from './statistics-page';

describe('StatisticsPage', () => {
  let fixture: ComponentFixture<StatisticsPage>;
  const loadLearningSummary = vi.fn(),
    loadQuizStatistics = vi.fn(),
    loadDifficultItems = vi.fn(),
    loadDeckStatistics = vi.fn(),
    loadConfidenceDistribution = vi.fn(),
    clear = vi.fn();
  /** Her testte boş endpoint state ve kontrollü facade intentleriyle sayfayı kurar. */
  beforeEach(() => {
    [
      loadLearningSummary,
      loadQuizStatistics,
      loadDifficultItems,
      loadDeckStatistics,
      loadConfidenceDistribution,
      clear,
    ].forEach((mock) => mock.mockClear());
    TestBed.configureTestingModule({
      imports: [StatisticsPage],
      providers: [
        provideRouter([]),
        {
          provide: StatisticsFacade,
          useValue: {
            learningSummaryStatus: signal('idle'),
            learningSummary: signal(null),
            learningSummaryError: signal(null),
            quizStatisticsStatus: signal('idle'),
            quizStatistics: signal(null),
            quizStatisticsError: signal(null),
            difficultItemsStatus: signal('idle'),
            difficultItems: signal(null),
            difficultItemsError: signal(null),
            deckStatisticsStatus: signal('idle'),
            deckStatistics: signal(null),
            deckStatisticsError: signal(null),
            confidenceDistributionStatus: signal('idle'),
            confidenceDistribution: signal(null),
            confidenceDistributionError: signal(null),
            loadLearningSummary,
            loadQuizStatistics,
            loadDifficultItems,
            loadDeckStatistics,
            loadConfidenceDistribution,
            clear,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(StatisticsPage);
    fixture.detectChanges();
  });
  /** Route açılışında beş statistics endpoint intentinin tamamını başlatır. */
  it('loads every real statistics source', () => {
    expect(loadLearningSummary).toHaveBeenCalledOnce();
    expect(loadQuizStatistics).toHaveBeenCalledOnce();
    expect(loadDifficultItems).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 20,
      source: 'both',
      sortBy: 'confidenceAsc',
    });
    expect(loadDeckStatistics).toHaveBeenCalledOnce();
    expect(loadConfidenceDistribution).toHaveBeenCalledOnce();
  });
  /** Tarih filtresi değiştiğinde from/to değerleriyle quiz endpointini yeniden çağırır. */
  it('reloads quiz statistics for a supported date range', () => {
    loadQuizStatistics.mockClear();
    const button = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((item) => item.textContent?.trim() === '7d')!;
    button.click();
    expect(loadQuizStatistics).toHaveBeenCalledWith(
      expect.objectContaining({
        fromUtc: expect.any(String),
        toUtc: expect.any(String),
        quizType: undefined,
      }),
    );
  });
});
