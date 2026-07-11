/**
 * Shell navigation bileşenlerinin kullandığı sunum sözleşmesini tanımlar.
 * User ve admin route sahipliğinin ortak layout bileşenlerine sızmasını engeller.
 */
export interface ShellNavigationItem {
  /** Kullanıcıya navigation üzerinde gösterilen okunabilir metindir. */
  readonly label: string;

  /** Angular Router tarafından açılacak canonical uygulama yoludur. */
  readonly route: string;

  /** Harici icon paketi olmadan kompakt navigation işareti olarak kullanılan kısa etikettir. */
  readonly shortLabel: string;
}
