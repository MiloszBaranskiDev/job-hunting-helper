import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { NotesGroup } from '@jhh/shared/interfaces';
import {
  AddNotePayload,
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
  AddNoteSuccessPayload,
  EditNotePayload,
  EditNoteSuccessPayload,
  RemoveNotePayload,
  RemoveNoteSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/interfaces';

export enum Type {
  SetNotes = '[Notes] Set Notes',
  AddNotesGroup = '[Notes] Add Notes Group',
  AddNotesGroupFail = '[Notes] Add Notes Group Fail',
  AddNotesGroupSuccess = '[Notes] Add Notes Group Success',
  AddNote = '[Notes] Add Note',
  AddNoteFail = '[Notes] Add Note Fail',
  AddNoteSuccess = '[Notes] Add Note Success',
  EditNote = '[Notes] Edit Note',
  EditNoteFail = '[Notes] Edit Note Fail',
  EditNoteSuccess = '[Notes] Edit Note Success',
  RemoveNote = '[Notes] Remove Note',
  RemoveNoteFail = '[Notes] Remove Note Fail',
  RemoveNoteSuccess = '[Notes] Remove Note Success',
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

export const addNote = createAction(
  Type.AddNote,
  props<{ payload: AddNotePayload }>()
);

export const addNoteFail = createAction(
  Type.AddNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addNoteSuccess = createAction(
  Type.AddNoteSuccess,
  props<{ payload: AddNoteSuccessPayload }>()
);

export const editNote = createAction(
  Type.EditNote,
  props<{ payload: EditNotePayload }>()
);

export const editNoteFail = createAction(
  Type.EditNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editNoteSuccess = createAction(
  Type.EditNoteSuccess,
  props<{ payload: EditNoteSuccessPayload }>()
);

export const removeNote = createAction(
  Type.RemoveNote,
  props<{ payload: RemoveNotePayload }>()
);

export const removeNoteFail = createAction(
  Type.RemoveNoteFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeNoteSuccess = createAction(
  Type.RemoveNoteSuccess,
  props<{ payload: RemoveNoteSuccessPayload }>()
);
