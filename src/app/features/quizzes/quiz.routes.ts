/** Bu dosya, quiz ekranlarını ortak feature providerlarıyla user shell altında lazy route olarak tanımlar. */
import { Routes } from '@angular/router';
import { provideDeckFeature } from '@features/decks/deck.providers';
import { provideQuizFeature } from './quiz.providers';

/** Start, active play ve summary ekranlarını gerçek Quiz/Deck providerlarıyla açar. */
export const QUIZ_ROUTES: Routes = [
  {
    path: '',
    providers: [provideQuizFeature(), provideDeckFeature()],
    children: [
      {
        path: 'start',
        loadComponent: () =>
          import('./pages/quiz-start-page/quiz-start-page').then((module) => module.QuizStartPage),
      },
      {
        path: ':quizSessionId/play',
        loadComponent: () =>
          import('./pages/quiz-play-page/quiz-play-page').then((module) => module.QuizPlayPage),
      },
      {
        path: ':quizSessionId/summary',
        loadComponent: () =>
          import('./pages/quiz-summary-page/quiz-summary-page').then(
            (module) => module.QuizSummaryPage,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'start' },
    ],
  },
];
