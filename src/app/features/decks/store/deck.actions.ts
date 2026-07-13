/** Bu dosya, deck collection/detail/create ve item mutation lifecycle actionlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { AddItemToDeckRequest, CreateDeckRequest } from '../models/deck-request.models';
import {
  AddedDeckItem,
  CreatedDeck,
  DeckCollection,
  DeckDetail,
  RemovedDeckItem,
} from '../models/deck.models';

/** Deck facade, effects ve reducer arasında kullanılan typesafe action grubudur. */
export const DeckActions = createActionGroup({
  source: 'Decks',
  events: {
    'Load Collection': emptyProps(),
    'Load Collection Success': props<{ readonly collection: DeckCollection }>(),
    'Load Collection Failure': props<{ readonly message: string }>(),
    'Load Detail': props<{ readonly deckId: string }>(),
    'Load Detail Success': props<{ readonly detail: DeckDetail }>(),
    'Load Detail Failure': props<{ readonly message: string }>(),
    'Create Deck': props<{ readonly request: CreateDeckRequest }>(),
    'Create Deck Success': props<{ readonly deck: CreatedDeck }>(),
    'Create Deck Failure': props<{ readonly message: string }>(),
    'Add Item': props<{ readonly deckId: string; readonly request: AddItemToDeckRequest }>(),
    'Add Item Success': props<{ readonly result: AddedDeckItem }>(),
    'Remove Item': props<{ readonly deckId: string; readonly userLearningItemId: string }>(),
    'Remove Item Success': props<{ readonly result: RemovedDeckItem }>(),
    'Item Mutation Failure': props<{ readonly message: string }>(),
    'Clear Detail': emptyProps(),
    'Clear Create State': emptyProps(),
    'Clear Item Mutation State': emptyProps(),
    Clear: emptyProps(),
  },
});
