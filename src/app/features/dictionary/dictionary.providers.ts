/** Bu dosya, dictionary state, effects, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { DictionaryApiService } from './api/dictionary-api.service';
import { DictionaryFacade } from './facades/dictionary.facade';
import { DictionaryEffects } from './store/dictionary.effects';
import { dictionaryFeature } from './store/dictionary.reducer';

/** F7C/F7E route ağacının dictionary feature bağımlılıklarını tek çağrıyla lazy kaydetmesini sağlar. */
export function provideDictionaryFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(dictionaryFeature),
    provideEffects(DictionaryEffects),
    DictionaryApiService,
    DictionaryFacade,
  ]);
}
