import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { NotesGroup } from '@jhh/shared/interfaces';
import {
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/interfaces';

export enum Type {
  SetNotes = '[Notes] Set Notes',
  AddNotesGroup = '[Notes] Add Notes Group',
  AddNotesGroupFail = '[Notes] Add Notes Group Fail',
  AddNotesGroupSuccess = '[Notes] Add Notes Group Success',
}

export const setNotes = createAction(
  Type.SetNotes,
  props<{ notesGroups: NotesGroup[] }>()
);

export const addNotesGroup = createAction(
  Type.AddNotesGroup,
  props<{ payload: AddNotesGroupPayload }>()
);

export const addNotesGroupFail = createAction(
  Type.AddNotesGroupFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addNotesGroupSuccess = createAction(
  Type.AddNotesGroupSuccess,
  props<{ payload: AddNotesGroupSuccessPayload }>()
);
