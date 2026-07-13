/** Bu dosya, lookup actionlarını gerçek API çağrısı ve DTO mapper akışına bağlar. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { LookupApiService } from '../api/lookup-api.service';
import { mapLookupResult } from '../mappers/lookup-view.mapper';
import { LookupActions } from './lookup.actions';

/** Lookup HTTP yan etkisini reducer, facade ve componentlerden izole eder. */
@Injectable()
export class LookupEffects {
  /** NgRx lookup action akışını effecte sağlar. */
  private readonly actions$ = inject(Actions);

  /** Gerçek `POST /api/lookups` requestini feature API servisi üzerinden yürütür. */
  private readonly lookupApiService = inject(LookupApiService);

  /** Yeni aramada önceki requesti iptal ederek yalnızca son kullanıcı niyetinin sonucunu state'e taşır. */
  readonly search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LookupActions.search),
      switchMap(({ request }) =>
        this.lookupApiService.lookup(request).pipe(
          map((dto) => LookupActions.searchSuccess({ result: mapLookupResult(dto) })),
          catchError((error: unknown) =>
            of(LookupActions.searchFailure({ message: getLookupErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatalarda güvenli lookup fallback metni döndürür. */
function getLookupErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Arama sonucu yüklenemedi.';
}
