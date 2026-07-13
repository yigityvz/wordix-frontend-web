/** Bu dosya, quiz state, effects, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { QuizApiService } from './api/quiz-api.service';
import { QuizFacade } from './facades/quiz.facade';
import { QuizEffects } from './store/quiz.effects';
import { quizFeature } from './store/quiz.reducer';

/** Quiz route ağacının feature bağımlılıklarını tek çağrıyla lazy kaydetmesini sağlar. */
export function provideQuizFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(quizFeature),
    provideEffects(QuizEffects),
    QuizApiService,
    QuizFacade,
  ]);
}
