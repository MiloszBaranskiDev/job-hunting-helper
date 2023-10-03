import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { NotesGroup } from '@jhh/shared/interfaces';

import * as NotesActions from './notes.actions';

export const NOTES_STATE_KEY = 'notes';

export interface NotesState extends EntityState<NotesGroup> {
  addNotesGroupInProgress: boolean;
  addNotesGroupError: string | null;
  removeNoteInProgress: boolean;
  removeNoteError: string | null;
  removeNoteSuccess: boolean;
}

export const adapter = createEntityAdapter<NotesGroup>();

export const initialNotesState: NotesState = adapter.getInitialState({
  addNotesGroupInProgress: false,
  addNotesGroupError: null,
  removeNoteInProgress: false,
  removeNoteError: null,
  removeNoteSuccess: false,
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
  })),
  on(NotesActions.removeNote, (state) => ({
    ...state,
    removeNoteInProgress: true,
    removeNoteError: null,
    removeNoteSuccess: false,
  })),
  on(NotesActions.removeNoteFail, (state, { payload }) => ({
    ...state,
    removeNoteInProgress: false,
    removeNoteError: payload.error.message,
  })),
  on(NotesActions.removeNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.removedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: group.notes.filter((note) => note.id !== payload.removedNote.id),
      };

      updatedEntities[payload.removedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          removeNoteInProgress: false,
          removeNoteSuccess: true,
        }
      );
    }

    return state;
  })
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
