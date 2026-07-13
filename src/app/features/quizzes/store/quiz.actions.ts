/** Bu dosya, quiz session, answer, summary ve recommendation save lifecycle actionlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { StartQuizRequest, SubmitQuizAnswerRequest } from '../models/quiz-request.models';
import {
  QuizAnswerResult,
  QuizSession,
  QuizSummary,
  SavedQuizRecommendation,
} from '../models/quiz.models';

/** Quiz facade, effects ve reducer arasında kullanılan typesafe action grubudur. */
export const QuizActions = createActionGroup({
  source: 'Quizzes',
  events: {
    'Start Quiz': props<{ readonly request: StartQuizRequest }>(),
    'Start Quiz Success': props<{ readonly session: QuizSession }>(),
    'Start Quiz Failure': props<{ readonly message: string }>(),
    'Submit Answer': props<{
      readonly quizSessionId: string;
      readonly request: SubmitQuizAnswerRequest;
    }>(),
    'Submit Answer Success': props<{ readonly result: QuizAnswerResult }>(),
    'Submit Answer Failure': props<{ readonly message: string }>(),
    'Load Summary': props<{ readonly quizSessionId: string }>(),
    'Load Summary Success': props<{ readonly summary: QuizSummary }>(),
    'Load Summary Failure': props<{ readonly message: string }>(),
    'Save Recommendation': props<{ readonly quizRecommendationItemId: string }>(),
    'Save Recommendation Success': props<{ readonly result: SavedQuizRecommendation }>(),
    'Save Recommendation Failure': props<{ readonly message: string }>(),
    'Clear Answer State': emptyProps(),
    'Clear Summary': emptyProps(),
    'Clear Recommendation Save State': emptyProps(),
    Clear: emptyProps(),
  },
});
