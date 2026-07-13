/** Bu dosya, profile yükleme kullanıcı niyeti ve API lifecycle actionlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Profile } from '../models/profile.models';

/** Profile facade, effect ve reducer arasında kullanılan typesafe action grubudur. */
export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ readonly profile: Profile }>(),
    'Load Failure': props<{ readonly message: string }>(),
    Clear: emptyProps(),
  },
});
