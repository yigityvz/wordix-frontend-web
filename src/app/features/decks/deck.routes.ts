/** Bu dosya, deck list ve detail sayfalarını feature providerlarıyla user shell altında lazy tanımlar. */
import { Routes } from '@angular/router';

import { provideDeckFeature } from './deck.providers';

/** Deck route ağacında list ve canonical detail ekranlarını ortak feature state ile açar. */
export const DECK_ROUTES: Routes = [
  {
    path: '',
    providers: [provideDeckFeature()],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/deck-list-page/deck-list-page').then((module) => module.DeckListPage),
      },
      {
        path: ':deckId',
        loadComponent: () =>
          import('./pages/deck-detail-page/deck-detail-page').then(
            (module) => module.DeckDetailPage,
          ),
      },
    ],
  },
];
