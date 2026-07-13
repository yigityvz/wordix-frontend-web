/** Bu dosya, statistics state, effects, API service ve facade providerlarını lazy route için birleştirir. */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { StatisticsApiService } from './api/statistics-api.service';
import { StatisticsFacade } from './facades/statistics.facade';
import { StatisticsEffects } from './store/statistics.effects';
import { statisticsFeature } from './store/statistics.reducer';
/** Statistics route ağacının bağımlılıklarını tek çağrıyla lazy kaydeder. */
export function provideStatisticsFeature():EnvironmentProviders{return makeEnvironmentProviders([provideState(statisticsFeature),provideEffects(StatisticsEffects),StatisticsApiService,StatisticsFacade]);}
