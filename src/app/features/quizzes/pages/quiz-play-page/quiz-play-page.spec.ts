/** Bu dosya, aktif quiz sayfasının gerçek answer payloadlarını ve kontrollü ilerlemesini doğrular. */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizFacade } from '../../facades/quiz.facade';
import { QuizAnswerResult, QuizSession } from '../../models/quiz.models';
import { QuizPlayPage } from './quiz-play-page';

/** Active page'in frontend doğruluk hesabı yapmadan facade sınırını koruduğunu sınar. */
describe('QuizPlayPage', () => {
  /** Her testte standalone page fixture'ını tutar. */
  let fixture: ComponentFixture<QuizPlayPage>;
  const submitAnswer = vi.fn();
  const clearAnswerState = vi.fn();
  const session = signal<QuizSession | null>(createSession());
  const latestAnswer = signal<QuizAnswerResult | null>(null);
  const answeredQuestionCount = signal(0);
  const saveRecommendation = vi.fn();
  const clearRecommendationSaveState = vi.fn();

  /** Canonical route param ve kontrollü facade signal state'iyle sayfayı kurar. */
  beforeEach(() => {
    submitAnswer.mockClear();
    clearAnswerState.mockClear();
    saveRecommendation.mockClear();
    clearRecommendationSaveState.mockClear();
    session.set(createSession());
    latestAnswer.set(null);
    answeredQuestionCount.set(0);
    TestBed.configureTestingModule({
      imports: [QuizPlayPage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ quizSessionId: 'session-1' }) } } },
        { provide: QuizFacade, useValue: { session, latestAnswer, isSubmittingAnswer: signal(false), answerError: signal(null), answeredQuestionCount, submitAnswer, clearAnswerState, isSavingRecommendation: signal(false), savedRecommendation: signal(null), recommendationSaveError: signal(null), saveRecommendation, clearRecommendationSaveState } },
      ],
    });
    fixture = TestBed.createComponent(QuizPlayPage);
    fixture.detectChanges();
  });

  /** Multiple-choice seçimini question ve option UUID'leriyle gerçek facade'a gönderir. */
  it('submits a canonical multiple-choice answer', () => {
    const option = (fixture.nativeElement as HTMLElement).querySelectorAll('button')[0] as HTMLButtonElement;
    option.click();
    fixture.detectChanges();
    const submit = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) => button.textContent?.includes('Submit answer'))!;
    submit.click();
    expect(submitAnswer).toHaveBeenCalledWith('session-1', expect.objectContaining({ quizQuestionId: 'question-1', selectedQuizOptionId: 'option-1', userAnswer: null }));
  });

  /** Backend feedbacki geldikten sonra Next question ile ikinci renderer'a ilerler. */
  it('advances only after backend feedback', () => {
    latestAnswer.set(createAnswer());
    answeredQuestionCount.set(1);
    fixture.detectChanges();
    const next = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) => button.textContent?.includes('Next question'))!;
    next.click();
    fixture.detectChanges();
    expect(clearAnswerState).toHaveBeenCalledOnce();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Write hello');
  });

  /** Backend uygunluk bayrağı ve recommendation UUID'si varsa gerçek save intentini gönderir. */
  it('saves an eligible recommendation with its backend id', () => {
    latestAnswer.set({ ...createAnswer(), isCorrect: false, isSystemRecommended: true, canAddRecommendedItemToDictionary: true, quizRecommendationItemId: 'recommendation-1', recommendationReason: 'Needs practice' });
    fixture.detectChanges();
    const saveButton = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((button) => button.textContent?.includes('Save to dictionary'))!;
    saveButton.click();
    expect(clearRecommendationSaveState).toHaveBeenCalledOnce();
    expect(saveRecommendation).toHaveBeenCalledWith('recommendation-1');
  });
  /** Route sessionı state'te yoksa desteklenmeyen reload davranışını taklit etmez. */
  it('shows an honest recovery state when the session cannot be reloaded', () => {
    session.set(null);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Quiz session is not available');
    expect(submitAnswer).not.toHaveBeenCalled();
  });
});

/** Testler için option ve writing sorusu içeren session üretir. */
function createSession(): QuizSession {
  return { quizSessionId: 'session-1', quizType: 'Test', quizSourceType: 'UserDictionary', quizContentMode: 'Mixed', includeSystemRecommendations: false, questionCount: 2, startedAt: '2026-01-01T00:00:00Z', status: 'InProgress', questions: [
    { quizQuestionId: 'question-1', questionOrder: 1, questionText: 'Choose hello', learningItemId: 'item-1', wordId: 'word-1', phraseId: null, sentenceId: null, itemType: 'Word', questionType: 'MultipleChoiceTranslation', isSystemRecommended: false, recommendationReason: null, quizRecommendationItemId: null, options: [{ quizOptionId: 'option-1', displayOrder: 1, optionText: 'Merhaba' }] },
    { quizQuestionId: 'question-2', questionOrder: 2, questionText: 'Write hello', learningItemId: 'item-2', wordId: 'word-2', phraseId: null, sentenceId: null, itemType: 'Word', questionType: 'TranslateToTargetLanguage', isSystemRecommended: false, recommendationReason: null, quizRecommendationItemId: null, options: [] },
  ] };
}

/** İlk soru için backend answer sonucuna denk test modeli üretir. */
function createAnswer(): QuizAnswerResult {
  return { quizAnswerId: 'answer-1', quizSessionId: 'session-1', quizQuestionId: 'question-1', selectedQuizOptionId: 'option-1', isCorrect: true, answerResult: 'Correct', isPartiallyCorrect: false, userAnswerText: null, selectedOptionText: 'Merhaba', correctAnswerText: 'Merhaba', questionResponseTimeInMilliseconds: 1000, answeredAt: '2026-01-01T00:00:01Z', correctCount: 1, wrongCount: 0, consecutiveCorrectCount: 1, consecutiveWrongCount: 0, previousLearningStatus: 'New', currentLearningStatus: 'Learning', previousConfidenceScore: 0, currentConfidenceScore: 10, nextReviewDate: null, progressUpdated: true, isSystemRecommended: false, quizRecommendationItemId: null, recommendationReason: null, canAddRecommendedItemToDictionary: false };
}



