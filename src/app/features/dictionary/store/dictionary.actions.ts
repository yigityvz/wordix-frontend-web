/** Bu dosya, dictionary ve notes kullanıcı niyetleri ile API lifecycle actionlarını tanımlar. */
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  SaveLearningItemRequest,
  SaveDictionaryNoteRequest,
  EditableDictionaryFlagType,
  SaveSentenceToDictionaryRequest,
} from '../models/dictionary-request.models';
import {
  DictionaryCollection,
  DictionaryItem,
  DictionaryNote,
  DictionaryNotesCollection,
  DictionaryFlag,
  DictionaryFlagsCollection,
  SavedLearningItem,
  SavedSentenceItem,
} from '../models/dictionary.models';

/** Dictionary facade, effects ve reducer arasında kullanılan typesafe action grubudur. */
export const DictionaryActions = createActionGroup({
  source: 'Dictionary',
  events: {
    'Load Collection': emptyProps(),
    'Load Collection Success': props<{ readonly collection: DictionaryCollection }>(),
    'Load Collection Failure': props<{ readonly message: string }>(),
    'Load Detail': props<{ readonly userLearningItemId: string }>(),
    'Load Detail Success': props<{ readonly item: DictionaryItem }>(),
    'Load Detail Failure': props<{ readonly message: string }>(),
    'Save Learning Item': props<{ readonly request: SaveLearningItemRequest }>(),
    'Save Learning Item Success': props<{ readonly result: SavedLearningItem }>(),
    'Save Sentence': props<{ readonly request: SaveSentenceToDictionaryRequest }>(),
    'Save Sentence Success': props<{ readonly result: SavedSentenceItem }>(),
    'Save Failure': props<{ readonly message: string }>(),
    'Load Notes': props<{ readonly userLearningItemId: string }>(),
    'Load Notes Success': props<{ readonly collection: DictionaryNotesCollection }>(),
    'Load Notes Failure': props<{ readonly message: string }>(),
    'Create Note': props<{
      readonly userLearningItemId: string;
      readonly request: SaveDictionaryNoteRequest;
    }>(),
    'Create Note Success': props<{ readonly note: DictionaryNote }>(),
    'Update Note': props<{
      readonly noteId: string;
      readonly request: SaveDictionaryNoteRequest;
    }>(),
    'Update Note Success': props<{ readonly note: DictionaryNote }>(),
    'Delete Note': props<{ readonly noteId: string }>(),
    'Delete Note Success': props<{ readonly note: DictionaryNote }>(),
    'Note Mutation Failure': props<{ readonly message: string }>(),
    'Load Flags': props<{ readonly userLearningItemId: string }>(),
    'Load Flags Success': props<{ readonly collection: DictionaryFlagsCollection }>(),
    'Load Flags Failure': props<{ readonly message: string }>(),
    'Set Flag': props<{
      readonly userLearningItemId: string;
      readonly flagType: EditableDictionaryFlagType;
    }>(),
    'Set Flag Success': props<{ readonly flag: DictionaryFlag }>(),
    'Remove Flag': props<{
      readonly userLearningItemId: string;
      readonly flagType: EditableDictionaryFlagType;
    }>(),
    'Remove Flag Success': props<{ readonly flag: DictionaryFlag }>(),
    'Flag Mutation Failure': props<{ readonly message: string }>(),
    'Clear Detail': emptyProps(),
    'Clear Notes': emptyProps(),
    'Clear Note Mutation State': emptyProps(),
    'Clear Flags': emptyProps(),
    'Clear Flag Mutation State': emptyProps(),
    'Clear Save State': emptyProps(),
    Clear: emptyProps(),
  },
});
