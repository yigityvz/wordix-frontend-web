/** Bu dosya, admin analytics state, effects, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AdminAnalyticsApiService } from './api/admin-analytics-api.service';
import { AdminAnalyticsFacade } from './facades/admin-analytics.facade';
import { AdminAnalyticsEffects } from './store/admin-analytics.effects';
import { adminAnalyticsFeature } from './store/admin-analytics.reducer';

/** Admin route ağacının analytics bağımlılıklarını tek çağrıyla lazy kaydeder. */
export function provideAdminAnalyticsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(adminAnalyticsFeature),
    provideEffects(AdminAnalyticsEffects),
    AdminAnalyticsApiService,
    AdminAnalyticsFacade,
  ]);
}
