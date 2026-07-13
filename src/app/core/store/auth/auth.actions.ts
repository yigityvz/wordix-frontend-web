/** Bu dosya, authentication kullanıcı niyetlerini ve lifecycle sonuçlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AuthUser } from '../../auth/auth.models';

/** Auth effect ve reducer arasında kullanılan typesafe action grubudur. */
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Initialize: emptyProps(),
    'Initialize Success': props<{ readonly user: AuthUser }>(),
    'Initialize Unauthenticated': emptyProps(),
    'Initialize Failure': props<{ readonly message: string }>(),
    'Session Changed': props<{ readonly user: AuthUser | null }>(),
    'Sign In Requested': emptyProps(),
    'Registration Requested': emptyProps(),
    'Logout Requested': emptyProps(),
    'Redirect Failure': props<{ readonly message: string }>(),
  },
});
