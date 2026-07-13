/** Bu dosya, lookup sayfasını feature providerlarıyla user shell altında lazy route olarak tanımlar. */
import { Routes } from '@angular/router';
import { provideDictionaryFeature } from '@features/dictionary/dictionary.providers';
import { provideDeckFeature } from '@features/decks/deck.providers';

import { provideLookupFeature } from './lookup.providers';

/** User shell child outletinde açılan gerçek lookup feature route kaydıdır. */
export const LOOKUP_ROUTES: Routes = [
  {
    path: '',
    providers: [provideLookupFeature(), provideDictionaryFeature(), provideDeckFeature()],
    loadComponent: () =>
      import('./pages/lookup-page/lookup-page').then((module) => module.LookupPage),
  },
];
