import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, RouterState } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';

export function provideRootStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideStore(),
    provideEffects(),
    provideRouterStore({ routerState: RouterState.Minimal }),
  ]);
}
