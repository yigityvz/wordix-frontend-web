/** Bu dosya, profile actionlarını gerçek API çağrısı ve DTO mapper akışına bağlar. */
import { inject, Injectable } from '@angular/core';
import { ApiError } from '@core/errors/api-error.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { ProfileApiService } from '../api/profile-api.service';
import { mapProfile } from '../mappers/profile.mapper';
import { ProfileActions } from './profile.actions';

/** Profile HTTP yan etkisini reducer ve page componentlerinden izole eder. */
@Injectable()
export class ProfileEffects {
  /** NgRx profile action akışını effecte sağlar. */
  private readonly actions$ = inject(Actions);

  /** Gerçek `/api/profile/me` endpoint çağrısını yürütür. */
  private readonly profileApiService = inject(ProfileApiService);

  /** Tekrarlanan load actionlarını request tamamlanana kadar engelleyerek profile verisini yükler. */
  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.load),
      exhaustMap(() =>
        this.profileApiService.getMe().pipe(
          map((dto) => ProfileActions.loadSuccess({ profile: mapProfile(dto) })),
          catchError((error: unknown) =>
            of(ProfileActions.loadFailure({ message: getProfileErrorMessage(error) })),
          ),
        ),
      ),
    ),
  );
}

/** Normalize ApiError mesajını korur; bilinmeyen hatalarda güvenli profile fallback metni döndürür. */
function getProfileErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Profil bilgileri yüklenemedi.';
}
