/** Bu dosya, lookup page katmanına NgRx ayrıntısı göstermeden state ve kullanıcı niyetleri sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { LookupRequest } from '../models/lookup-request.model';
import { LookupActions } from '../store/lookup.actions';
import {
  selectError,
  selectHasResult,
  selectIsLoading,
  selectRequest,
  selectResult,
  selectStatus,
} from '../store/lookup.selectors';

/** Lookup feature componentlerinin kullanacağı tek state ve action köprüsüdür. */
@Injectable()
export class LookupFacade {
  /** Lookup feature state action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Güncel lookup request lifecycle durumunu signal olarak sunar. */
  readonly status = this.store.selectSignal(selectStatus);

  /** Son gönderilen lookup requestini retry veya form state için sunar. */
  readonly request = this.store.selectSignal(selectRequest);

  /** Normalize edilmiş gerçek backend lookup sonucunu sunar. */
  readonly result = this.store.selectSignal(selectResult);

  /** Loading ve tekrar-submit davranışını kontrol edecek türetilmiş durumu sunar. */
  readonly isLoading = this.store.selectSignal(selectIsLoading);

  /** Başarılı bir sonuç bulunup bulunmadığını UI'a sunar. */
  readonly hasResult = this.store.selectSignal(selectHasResult);

  /** Normalize API hata mesajını recoverable UI state için sunar. */
  readonly error = this.store.selectSignal(selectError);

  /** Kullanıcının lookup niyetini gerçek API effect akışına gönderir. */
  search(request: LookupRequest): void {
    this.store.dispatch(LookupActions.search({ request }));
  }

  /** Lookup sayfası kapanırken veya kullanıcı temizlediğinde feature state'ini sıfırlar. */
  clear(): void {
    this.store.dispatch(LookupActions.clear());
  }
}
