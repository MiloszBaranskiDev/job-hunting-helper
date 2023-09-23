import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { NotesGroup } from '@jhh/shared/interfaces';

import * as NotesActions from './notes.actions';

export const NOTES_STATE_KEY = 'notes';

export interface NotesState extends EntityState<NotesGroup> {}

export const adapter = createEntityAdapter<NotesGroup>();

export const initialNotesState: NotesState = adapter.getInitialState();

const reducer: ActionReducer<NotesState> = createReducer(
  initialNotesState,
  on(NotesActions.setNotes, (state, { notesGroups }) =>
    adapter.setAll(notesGroups, state)
  )
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
