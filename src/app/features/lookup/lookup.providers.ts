/** Bu dosya, lookup state, effect, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { LookupApiService } from './api/lookup-api.service';
import { LookupFacade } from './facades/lookup.facade';
import { LookupEffects } from './store/lookup.effects';
import { lookupFeature } from './store/lookup.reducer';

/** F6C route ağacının lookup feature bağımlılıklarını tek çağrıyla lazy kaydetmesini sağlar. */
export function provideLookupFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(lookupFeature),
    provideEffects(LookupEffects),
    LookupApiService,
    LookupFacade,
  ]);
}
