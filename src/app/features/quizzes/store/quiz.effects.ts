/** Bu dosya, quiz action akışını gerçek API çağrıları ve DTO mapperlarla birleştirir. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';

import { QuizApiService } from '../api/quiz-api.service';
import {
  mapQuizAnswerResult,
  mapQuizSession,
  mapQuizSummary,
  mapSavedQuizRecommendation,
} from '../mappers/quiz.mapper';
import { QuizActions } from './quiz.actions';

/** Quiz HTTP yan etkilerini reducer, facade ve componentlerden izole eder. */
@Injectable()
export class QuizEffects {
  /** NgRx quiz action akışını effectlere sağlar. */
  private readonly actions$ = inject(Actions);

  /** Gerçek quiz endpointlerini feature API servisi üzerinden çağırır. */
  private readonly quizApiService = inject(QuizApiService);

  /** Tekrarlanan start submitlerini engelleyip backend session sonucunu state'e taşır. */
  readonly startQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.startQuiz),
      exhaustMap(({ request }) =>
        this.quizApiService.startQuiz(request).pipe(
          map((dto) => QuizActions.startQuizSuccess({ session: mapQuizSession(dto) })),
          catchError((error: unknown) =>
            of(
              QuizActions.startQuizFailure({
                message: getQuizErrorMessage(error, 'Quiz başlatılamadı.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Cevap submitlerini tek sırada çalıştırıp yalnızca backend değerlendirmesini state'e taşır. */
  readonly submitAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.submitAnswer),
      exhaustMap(({ quizSessionId, request }) =>
        this.quizApiService.submitAnswer(quizSessionId, request).pipe(
          map((dto) => QuizActions.submitAnswerSuccess({ result: mapQuizAnswerResult(dto) })),
          catchError((error: unknown) =>
            of(
              QuizActions.submitAnswerFailure({
                message: getQuizErrorMessage(error, 'Cevap gönderilemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Route değişiminde önceki summary isteğini iptal edip son session özetini yükler. */
  readonly loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.loadSummary),
      switchMap(({ quizSessionId }) =>
        this.quizApiService.getSummary(quizSessionId).pipe(
          map((dto) => QuizActions.loadSummarySuccess({ summary: mapQuizSummary(dto) })),
          catchError((error: unknown) =>
            of(
              QuizActions.loadSummaryFailure({
                message: getQuizErrorMessage(error, 'Quiz özeti yüklenemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Recommendation save tekrarlarını engelleyip gerçek dictionary sonucunu state'e taşır. */
  readonly saveRecommendation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuizActions.saveRecommendation),
      exhaustMap(({ quizRecommendationItemId }) =>
        this.quizApiService.saveRecommendation(quizRecommendationItemId).pipe(
          map((dto) =>
            QuizActions.saveRecommendationSuccess({
              result: mapSavedQuizRecommendation(dto),
            }),
          ),
          catchError((error: unknown) =>
            of(
              QuizActions.saveRecommendationFailure({
                message: getQuizErrorMessage(error, 'Önerilen içerik kaydedilemedi.'),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatalarda operasyona özel güvenli fallback döndürür. */
function getQuizErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof ApiError ? error.message : fallbackMessage;
}
