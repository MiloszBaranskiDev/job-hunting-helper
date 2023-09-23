import { createAction, props } from '@ngrx/store';

import { NotesGroup } from '@jhh/shared/interfaces';

export enum Type {
  SetNotes = '[Notes] Set Notes',
}

export const setNotes = createAction(
  Type.SetNotes,
  props<{ notesGroups: NotesGroup[] }>()
);
