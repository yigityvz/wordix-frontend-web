/** Bu dosya, profile page ve layout katmanına NgRx ayrıntısı göstermeden state ve niyet sunar. */
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProfileActions } from '../store/profile.actions';
import {
  selectError,
  selectIsLoaded,
  selectIsLoading,
  selectProfile,
  selectStatus,
} from '../store/profile.selectors';

/** Profile feature componentlerinin kullanacağı tek state köprüsüdür. */
@Injectable()
export class ProfileFacade {
  /** Profile feature state action ve selector erişimini sağlar. */
  private readonly store = inject(Store);

  /** Güvenli profile görünüm modelini signal olarak sunar. */
  readonly profile = this.store.selectSignal(selectProfile);

  /** Profile request lifecycle durumunu signal olarak sunar. */
  readonly status = this.store.selectSignal(selectStatus);

  /** Loading/skeleton görünümü için yükleme durumunu sunar. */
  readonly isLoading = this.store.selectSignal(selectIsLoading);

  /** Tekrarlanan gereksiz yüklemeyi önlemek için loaded durumunu sunar. */
  readonly isLoaded = this.store.selectSignal(selectIsLoaded);

  /** API hata durumunda güvenli kullanıcı mesajını sunar. */
  readonly error = this.store.selectSignal(selectError);

  /** Current-user profile bilgisinin gerçek backend endpointinden yüklenmesini başlatır. */
  load(): void {
    this.store.dispatch(ProfileActions.load());
  }

  /** Logout veya feature teardown sırasında profile state'ini başlangıç değerine döndürür. */
  clear(): void {
    this.store.dispatch(ProfileActions.clear());
  }
}
