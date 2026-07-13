/** Bu dosya, profile feature state, effect, API service ve facade providerlarını tek noktada toplar. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ProfileApiService } from './api/profile-api.service';
import { ProfileFacade } from './facades/profile.facade';
import { ProfileEffects } from './store/profile.effects';
import { profileFeature } from './store/profile.reducer';

/** Profile route ağacına lazy feature bağımlılıklarını birlikte kaydeder. */
export function provideProfileFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(profileFeature),
    provideEffects(ProfileEffects),
    ProfileApiService,
    ProfileFacade,
  ]);
}
