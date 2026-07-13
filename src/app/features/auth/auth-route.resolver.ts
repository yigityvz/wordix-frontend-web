/** Bu dosya, gerçek backend profil rollerinden login sonrası güvenli hedef route'u belirler. */
import { WordixRole } from '@core/auth/auth.models';

/** Admin önceliğini koruyarak kullanıcıyı yetkili olduğu uygulama alanına yönlendirir. */
export function resolvePostLoginRoute(
  roles: readonly WordixRole[],
  returnUrl: string | null,
): string {
  // Her iki role sahip hesaplarda ürün kararına göre admin alanı her zaman önceliklidir.
  if (roles.includes('admin')) {
    return '/admin/dashboard';
  }

  // Basic user yalnızca admin alanı dışındaki doğrulanmış iç route'una geri dönebilir.
  if (roles.includes('basic_user')) {
    return returnUrl && !returnUrl.startsWith('/admin/') ? returnUrl : '/dashboard';
  }

  // Tanınan Wordix rolü olmayan authenticated hesap korumalı alanlara alınmaz.
  return '/forbidden';
}
