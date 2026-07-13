/** Bu dosya, profile feature state'ini sayfa ve layout için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { profileFeature } from './profile.reducer';

/** NgRx feature tarafından üretilen temel profile selectorlarıdır. */
export const { selectProfileState, selectStatus, selectProfile, selectError } = profileFeature;

/** Profile endpointinin halen yüklenmekte olup olmadığını seçer. */
export const selectIsLoading = createSelector(selectStatus, (status) => status === 'loading');

/** Profile verisinin en az bir kez başarıyla yüklenip yüklenmediğini seçer. */
export const selectIsLoaded = createSelector(selectStatus, (status) => status === 'loaded');
