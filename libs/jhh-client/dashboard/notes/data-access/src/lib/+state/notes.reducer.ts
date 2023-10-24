import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Note, NotesGroup } from '@jhh/shared/interfaces';

import * as NotesActions from './notes.actions';

export const NOTES_STATE_KEY = 'notes';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
  success?: boolean;
}

export interface NotesState extends EntityState<NotesGroup> {
  addNotesGroup: OperationState;
  addNote: OperationState;
  editNote: OperationState;
  duplicateNote: OperationState;
  changeNoteGroup: OperationState;
  removeNote: OperationState;
}

export const adapter = createEntityAdapter<NotesGroup>();

export const initialNotesState: NotesState = adapter.getInitialState({
  addNotesGroup: {
    inProgress: false,
    error: null,
    success: false,
  },
  addNote: {
    inProgress: false,
    error: null,
    success: false,
  },
  editNote: {
    inProgress: false,
    error: null,
  },
  duplicateNote: {
    inProgress: false,
    error: null,
    success: false,
  },
  changeNoteGroup: {
    inProgress: false,
    error: null,
  },
  removeNote: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<NotesState> = createReducer(
  initialNotesState,
  on(NotesActions.setNotes, (state, { notesGroups }) =>
    adapter.setAll(notesGroups, state)
  ),
  on(NotesActions.addNotesGroup, (state) => ({
    ...state,
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: true,
      success: false,
    },
  })),
  on(NotesActions.addNotesGroupFail, (state, { payload }) => ({
    ...state,
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.addNotesGroupSuccess, (state, { payload }) => ({
    ...adapter.addOne(payload.newNotesGroup, state),
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: false,
      success: true,
    },
  })),
  on(NotesActions.addNote, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.addNoteFail, (state, { payload }) => ({
    ...state,
    addNote: {
      ...state.addNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.addNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.newNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: [...group.notes, payload.newNote],
      };

      updatedEntities[payload.newNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          addNote: {
            ...state.addNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.editNote, (state) => ({
    ...state,
    editNote: {
      ...state.editNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.editNoteFail, (state, { payload }) => ({
    ...state,
    editNote: {
      ...state.editNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.editNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.updatedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: group.notes.map((note) =>
          note.id === payload.updatedNote.id ? payload.updatedNote : note
        ),
      };

      updatedEntities[payload.updatedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          editNote: {
            ...state.editNote,
            inProgress: false,
            error: null,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.duplicateNote, (state) => ({
    ...state,
    duplicateNote: {
      ...state.duplicateNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.duplicateNoteFail, (state, { payload }) => ({
    ...state,
    duplicateNote: {
      ...state.duplicateNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.duplicateNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.duplicatedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: [...group.notes, payload.duplicatedNote],
      };

      updatedEntities[payload.duplicatedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          duplicateNote: {
            ...state.duplicateNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.changeNoteGroup, (state) => ({
    ...state,
    changeNoteGroup: {
      ...state.changeNoteGroup,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.changeNoteGroupFail, (state, { payload }) => ({
    ...state,
    changeNoteGroup: {
      ...state.changeNoteGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.changeNoteGroupSuccess, (state, { payload }) => {
    const { movedNote, previousGroup } = payload;
    const updatedEntities = { ...state.entities };

    if (previousGroup) {
      const updatedPreviousGroup: NotesGroup = {
        ...previousGroup,
        notes: previousGroup.notes.filter(
          (note: Note) => note.id !== movedNote.id
        ),
      };

      updatedEntities[previousGroup.id] = updatedPreviousGroup;
    }

    const newGroup: NotesGroup | undefined = updatedEntities[movedNote.groupId];
    if (newGroup) {
      const updatedNewGroup: NotesGroup = {
        ...newGroup,
        notes: [...newGroup.notes, movedNote],
      };

      updatedEntities[movedNote.groupId] = updatedNewGroup;
    }

    return adapter.setAll(
      Object.values(updatedEntities).filter(
        (group): group is NotesGroup => group !== undefined
      ),
      {
        ...state,
        changeNoteGroup: {
          ...state.changeNoteGroup,
          inProgress: false,
        },
      }
    );
  }),
  on(NotesActions.removeNote, (state) => ({
    ...state,
    removeNote: {
      ...state.removeNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.removeNoteFail, (state, { payload }) => ({
    ...state,
    removeNote: {
      ...state.removeNote,
      inProgress: false,
      error: payload.error.message,
    },
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
          removeNote: {
            ...state.removeNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  })
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
