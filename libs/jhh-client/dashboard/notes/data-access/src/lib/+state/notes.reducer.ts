import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { NotesGroup } from '@jhh/shared/interfaces';

import * as NotesActions from './notes.actions';

export const NOTES_STATE_KEY = 'notes';

export interface NotesState extends EntityState<NotesGroup> {
  addNotesGroupInProgress: boolean;
  addNotesGroupError: string | null;
}

export const adapter = createEntityAdapter<NotesGroup>();

export const initialNotesState: NotesState = adapter.getInitialState({
  addNotesGroupInProgress: false,
  addNotesGroupError: null,
});

const reducer: ActionReducer<NotesState> = createReducer(
  initialNotesState,
  on(NotesActions.setNotes, (state, { notesGroups }) =>
    adapter.setAll(notesGroups, state)
  ),
  on(NotesActions.addNotesGroup, (state) => ({
    ...state,
    addNotesGroupInProgress: true,
  })),
  on(NotesActions.addNotesGroupFail, (state, { payload }) => ({
    ...state,
    addNotesGroupInProgress: false,
    addNotesGroupError: payload.error.message,
  })),
  on(NotesActions.addNotesGroupSuccess, (state, { payload }) => ({
    ...adapter.addOne(payload.newNotesGroup, state),
    addNotesGroupInProgress: false,
  }))
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
