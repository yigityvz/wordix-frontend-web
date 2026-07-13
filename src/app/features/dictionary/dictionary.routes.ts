/** Bu dosya, dictionary liste sayfasını feature providerlarıyla user shell altında lazy route olarak tanımlar. */
import { Routes } from '@angular/router';
import { provideDeckFeature } from '@features/decks/deck.providers';

import { provideDictionaryFeature } from './dictionary.providers';

/** Dictionary route ağacında liste ve canonical detail ekranlarını ortak feature state ile açar. */
export const DICTIONARY_ROUTES: Routes = [
  {
    path: '',
    providers: [provideDictionaryFeature(), provideDeckFeature()],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/dictionary-list-page/dictionary-list-page').then(
            (module) => module.DictionaryListPage,
          ),
      },
      {
        path: ':userLearningItemId',
        loadComponent: () =>
          import('./pages/dictionary-detail-page/dictionary-detail-page').then(
            (module) => module.DictionaryDetailPage,
          ),
      },
    ],
  },
];
