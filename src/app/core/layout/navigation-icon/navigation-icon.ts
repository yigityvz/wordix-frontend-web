/**
 * Shell navigation ikonlarını tek, erişilebilir ve dış paket gerektirmeyen SVG bileşeninde sunar.
 * Sidebar ve mobile navigation aynı çizgi ikonlarını kullanır.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShellNavigationIcon } from '../navigation.models';

@Component({
  selector: 'wx-navigation-icon',
  templateUrl: './navigation-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationIcon {
  /** Render edilecek canonical navigation ikonunu parent bileşenden alır. */
  readonly name = input.required<ShellNavigationIcon>();

  /** İkonun bulunduğu yüzeye göre piksel boyutunu ayarlar. */
  readonly size = input(18);
}
