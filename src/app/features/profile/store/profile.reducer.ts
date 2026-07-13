/** Bu dosya, profile action sonuçlarını immutable feature state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { ProfileActions } from './profile.actions';
import { initialProfileState } from './profile.state';

/** Profile request lifecycle actionlarının tek saf state güncelleme noktasıdır. */
export const profileReducer = createReducer(
  initialProfileState,
  on(ProfileActions.load, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),
  on(ProfileActions.loadSuccess, (_state, { profile }) => ({
    status: 'loaded' as const,
    profile,
    error: null,
  })),
  on(ProfileActions.loadFailure, (state, { message }) => ({
    ...state,
    status: 'error' as const,
    error: message,
  })),
  on(ProfileActions.clear, () => initialProfileState),
);

/** Lazy route provider üzerinden `profile` adıyla kaydedilecek NgRx feature tanımıdır. */
export const profileFeature = createFeature({
  name: 'profile',
  reducer: profileReducer,
});
