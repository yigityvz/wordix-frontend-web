/** Bu dosya, lookup feature state'ini page ve componentler için türetilmiş selectorlara dönüştürür. */
import { createSelector } from '@ngrx/store';

import { lookupFeature } from './lookup.reducer';

/** NgRx feature tarafından üretilen temel lookup selectorlarıdır. */
export const { selectLookupState, selectStatus, selectRequest, selectResult, selectError } =
  lookupFeature;

/** Lookup endpoint requestinin halen sürüp sürmediğini seçer. */
export const selectIsLoading = createSelector(selectStatus, (status) => status === 'loading');

/** UI'ın gösterebileceği başarılı bir lookup sonucu bulunup bulunmadığını seçer. */
export const selectHasResult = createSelector(selectResult, (result) => result !== null);
