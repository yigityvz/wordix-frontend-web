/** Bu dosya, deck state, effects, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { DeckApiService } from './api/deck-api.service';
import { DeckFacade } from './facades/deck.facade';
import { DeckEffects } from './store/deck.effects';
import { deckFeature } from './store/deck.reducer';

/** Deck route ağacının feature bağımlılıklarını tek çağrıyla lazy kaydetmesini sağlar. */
export function provideDeckFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(deckFeature),
    provideEffects(DeckEffects),
    DeckApiService,
    DeckFacade,
  ]);
}
