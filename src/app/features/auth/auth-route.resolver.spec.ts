/** Bu dosya, callback sonrası admin önceliği ve güvenli basic-user dönüş kararlarını doğrular. */
import { describe, expect, it } from 'vitest';

import { resolvePostLoginRoute } from './auth-route.resolver';

/** Role göre canonical hedef route hesaplamasını sınar. */
describe('resolvePostLoginRoute', () => {
  /** İki role sahip kullanıcının basic-user returnUrl olsa bile admin paneline gittiğini doğrular. */
  it('prioritizes admin when both roles exist', () => {
    expect(resolvePostLoginRoute(['basic_user', 'admin'], '/dashboard')).toBe('/admin/dashboard');
  });

  /** Basic user için güvenli uygulama içi dönüş adresini korur. */
  it('returns a safe user route for a basic user', () => {
    expect(resolvePostLoginRoute(['basic_user'], '/dictionary')).toBe('/dictionary');
  });

  /** Basic user'ın admin route'una taşınmasını engeller. */
  it('rejects an admin return route for a basic user', () => {
    expect(resolvePostLoginRoute(['basic_user'], '/admin/dashboard')).toBe('/dashboard');
  });

  /** Tanınan rolü olmayan hesabı forbidden sayfasına yönlendirir. */
  it('routes an account without a Wordix role to forbidden', () => {
    expect(resolvePostLoginRoute([], null)).toBe('/forbidden');
  });
});
