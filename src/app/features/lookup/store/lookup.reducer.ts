/** Bu dosya, lookup action sonuçlarını immutable feature state değişimlerine uygular. */
import { createFeature, createReducer, on } from '@ngrx/store';

import { LookupActions } from './lookup.actions';
import { initialLookupState } from './lookup.state';

/** Lookup API lifecycle actionlarının tek saf state güncelleme noktasıdır. */
export const lookupReducer = createReducer(
  initialLookupState,
  on(LookupActions.search, (_state, { request }) => ({
    status: 'loading' as const,
    request,
    result: null,
    error: null,
  })),
  on(LookupActions.searchSuccess, (state, { result }) => ({
    ...state,
    status: 'loaded' as const,
    result,
    error: null,
  })),
  on(LookupActions.searchFailure, (state, { message }) => ({
    ...state,
    status: 'error' as const,
    result: null,
    error: message,
  })),
  on(LookupActions.clear, () => initialLookupState),
);

/** Lazy route provider üzerinden `lookup` adıyla kaydedilecek NgRx feature tanımıdır. */
export const lookupFeature = createFeature({
  name: 'lookup',
  reducer: lookupReducer,
});
