/** Bu dosya, lookup kullanıcı niyeti ve gerçek API request lifecycle actionlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { LookupRequest } from '../models/lookup-request.model';
import { LookupResult } from '../models/lookup-response.model';

/** Lookup facade, effect ve reducer arasında kullanılan typesafe action grubudur. */
export const LookupActions = createActionGroup({
  source: 'Lookup',
  events: {
    Search: props<{ readonly request: LookupRequest }>(),
    'Search Success': props<{ readonly result: LookupResult }>(),
    'Search Failure': props<{ readonly message: string }>(),
    Clear: emptyProps(),
  },
});
