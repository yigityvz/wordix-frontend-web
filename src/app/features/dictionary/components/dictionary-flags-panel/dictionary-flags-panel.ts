/** Bu dosya, Favorite ve Difficult flag durumlarını gerçek toggle intentleriyle sunan feature UI componentidir. */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '@shared/components/button/button';
import { Card } from '@shared/components/card/card';
import { Spinner } from '@shared/components/spinner/spinner';

import { EditableDictionaryFlagType } from '../../models/dictionary-request.models';

/** Flag collection state'ini gösterir ve set/remove kararını parent page'e bırakır. */
@Component({
  selector: 'wx-dictionary-flags-panel',
  imports: [Button, Card, Spinner],
  templateUrl: './dictionary-flags-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryFlagsPanel {
  /** Gerçek flags collection içindeki Favorite durumunu alır. */
  readonly favorite = input(false);

  /** Gerçek flags collection içindeki Difficult durumunu alır. */
  readonly difficult = input(false);

  /** Flags collection requestinin sürdüğünü belirtir. */
  readonly loading = input(false);

  /** Flags collection için recoverable API hata mesajını alır. */
  readonly error = input<string | null>(null);

  /** Set veya remove mutation requestinin sürdüğünü belirtir. */
  readonly mutating = input(false);

  /** Loading göstergesinin hangi flag kontrolünde gösterileceğini belirler. */
  readonly mutatingFlagType = input<EditableDictionaryFlagType | null>(null);

  /** Son flag mutation API hata mesajını panelde sunar. */
  readonly mutationError = input<string | null>(null);

  /** Flags collection yeniden yükleme niyetini parenta bildirir. */
  readonly reload = output<void>();

  /** Seçilen canonical flag tipi ve hedef aktiflik durumunu parenta bildirir. */
  readonly toggleRequested = output<{
    readonly flagType: EditableDictionaryFlagType;
    readonly active: boolean;
  }>();

  /** Yeni flag intentinden önce eski mutation hatasını temizleme niyetini parenta bildirir. */
  readonly mutationResetRequested = output<void>();

  /** Favorite kontrolünün set veya remove hedefini güncel backend stateinden türetir. */
  protected toggleFavorite(): void {
    this.emitToggle('Favorite', !this.favorite());
  }

  /** Difficult kontrolünün set veya remove hedefini güncel backend stateinden türetir. */
  protected toggleDifficult(): void {
    this.emitToggle('Difficult', !this.difficult());
  }

  /** Mutation sürmezken canonical toggle intentini tek noktadan yayınlar. */
  private emitToggle(flagType: EditableDictionaryFlagType, active: boolean): void {
    if (this.mutating()) {
      return;
    }

    this.mutationResetRequested.emit();
    this.toggleRequested.emit({ flagType, active });
  }
}
