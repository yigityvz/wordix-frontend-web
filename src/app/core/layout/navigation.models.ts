/**
 * Shell navigation bileşenlerinin kullandığı sunum sözleşmesini tanımlar.
 * User ve admin route sahipliğinin ortak layout bileşenlerine sızmasını engeller.
 */

/** Navigation içinde desteklenen gerçek SVG ikon anahtarlarıdır. */
export type ShellNavigationIcon =
  | 'dashboard'
  | 'search'
  | 'dictionary'
  | 'decks'
  | 'quiz'
  | 'statistics'
  | 'settings'
  | 'trending'
  | 'saved'
  | 'wrong'
  | 'provider';

/** Sidebar ve mobile navigation için route ve görünüm bilgisidir. */
export interface ShellNavigationItem {
  /** Kullanıcıya navigation üzerinde gösterilen okunabilir metindir. */
  readonly label: string;

  /** Angular Router tarafından açılacak canonical uygulama yoludur. */
  readonly route: string;

  /** Route amacını görsel olarak anlatan canonical ikon anahtarıdır. */
  readonly icon: ShellNavigationIcon;
}
