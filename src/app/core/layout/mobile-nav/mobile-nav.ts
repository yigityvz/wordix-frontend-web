/**
 * Dokunmatik ekranlar için kompakt alt navigation alanını sunar.
 * Route sahipliğini shell'den alır ve mobil alanı en fazla beş birincil bağlantıyla sınırlar.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ShellNavigationItem } from '../navigation.models';

@Component({
  selector: 'wx-mobile-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNav {
  /** Shell sahibinin mobile uygun sırayla verdiği route bağlantılarıdır. */
  readonly items = input<readonly ShellNavigationItem[]>([]);

  /** Küçük ekranda taşmayı önlemek için ilk beş navigation kaydını türetir. */
  protected readonly visibleItems = computed(() => this.items().slice(0, 5));
}
