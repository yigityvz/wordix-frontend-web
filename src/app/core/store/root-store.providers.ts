/**
 * Registers root NgRx infrastructure for application and router state.
 * Keeps one-time store providers out of feature modules and the bootstrap file.
 */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, RouterState } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';

import { AuthEffects } from './auth/auth.effects';
import { authFeature } from './auth/auth.reducer';

export function provideRootStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideStore(),
    // Root authentication state ve Keycloak yan etkilerini uygulama genelinde etkinleştirir.
    provideState(authFeature),
    provideEffects(AuthEffects),
    provideRouterStore({ routerState: RouterState.Minimal }),
  ]);
}
