/** Bu dosya, summary sayfasının route UUID'siyle gerçek facade requesti ve backend verisi kullandığını doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizFacade } from '../../facades/quiz.facade';
import { QuizSummary } from '../../models/quiz.models';
import { QuizSummaryPage } from './quiz-summary-page';

/** Summary ekranının aggregate değerleri frontendde yeniden hesaplamadığını sınar. */
describe('QuizSummaryPage', () => {
  /** Her testte standalone summary fixture'ını tutar. */
  let fixture: ComponentFixture<QuizSummaryPage>;
  const loadSummary = vi.fn();
  const clearSummary = vi.fn();
  const summary = signal<QuizSummary | null>(createSummary());

  /** Canonical route paramı ve kontrollü facade signal state'iyle sayfayı kurar. */
  beforeEach(() => {
    loadSummary.mockClear();
    clearSummary.mockClear();
    summary.set(createSummary());
    TestBed.configureTestingModule({
      imports: [QuizSummaryPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ quizSessionId: 'session-1' }) } },
        },
        {
          provide: QuizFacade,
          useValue: {
            isSummaryLoading: signal(false),
            summaryError: signal(null),
            summary,
            loadSummary,
            clearSummary,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(QuizSummaryPage);
    fixture.detectChanges();
  });

  /** Route açılışında ownership kontrollü summary endpoint intentini session UUID'siyle başlatır. */
  it('loads the real summary for the route session', () => {
    expect(clearSummary).toHaveBeenCalled();
    expect(loadSummary).toHaveBeenCalledWith('session-1');
  });

  /** Backend aggregate ve question breakdown değerlerini değişmeden gösterir. */
  it('renders backend summary metrics and question review', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('75%');
    expect(text).toContain('3 of 4 questions');
    expect(text).toContain('Choose hello');
    expect(text).toContain('Incorrect');
  });
});

/** Testler için backend summary payloadına denk normalize model üretir. */
function createSummary(): QuizSummary {
  return {
    quizSessionId: 'session-1',
    quizType: 'Test',
    quizSourceType: 'UserDictionary',
    quizContentMode: 'Mixed',
    status: 'InProgress',
    startedAt: '2026-01-01T00:00:00Z',
    totalQuestionCount: 4,
    answeredQuestionCount: 3,
    unansweredQuestionCount: 1,
    correctAnswerCount: 2,
    wrongAnswerCount: 1,
    accuracyRate: 75,
    completionRate: 75,
    averageQuestionResponseTimeInMilliseconds: 1500,
    fastestQuestionResponseTimeInMilliseconds: 1000,
    slowestQuestionResponseTimeInMilliseconds: 2000,
    questions: [
      {
        quizQuestionId: 'question-1',
        questionOrder: 1,
        questionText: 'Choose hello',
        learningItemId: 'item-1',
        isAnswered: true,
        isCorrect: false,
        selectedQuizOptionId: 'option-1',
        selectedAnswerText: 'Selam',
        correctAnswerText: 'Merhaba',
        questionResponseTimeInMilliseconds: 1500,
        answeredAt: '2026-01-01T00:00:01Z',
      },
    ],
  };
}
