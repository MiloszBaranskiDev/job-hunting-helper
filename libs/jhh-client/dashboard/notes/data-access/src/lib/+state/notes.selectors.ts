import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, NOTES_STATE_KEY, NotesState } from './notes.reducer';

import { NotesGroup } from '@jhh/shared/interfaces';

export const selectNotesState =
  createFeatureSelector<NotesState>(NOTES_STATE_KEY);

export const {
  selectIds: selectNoteIds,
  selectEntities: selectNoteEntities,
  selectAll: selectAllNotes,
  selectTotal: selectTotalNotes,
} = adapter.getSelectors(selectNotesState);

export const selectNotesGroups = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[]) => notesGroups
);

export const selectNotesGroupBySlug = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], slug: string) =>
    notesGroups.find((group) => group.slug === slug)
);

export const selectNoteBySlugs = createSelector(
  selectAllNotes,
  (
    notesGroups: NotesGroup[],
    props: { groupSlug: string; noteSlug: string }
  ) => {
    const group: NotesGroup | undefined = notesGroups.find(
      (group) => group.slug === props.groupSlug
    );
    return group
      ? group.notes.find((note) => note.slug === props.noteSlug)
      : null;
  }
);

export const selectAddNotesGroupInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNotesGroupInProgress
);

export const selectAddNotesGroupError = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNotesGroupError
);

export const selectAddNotesGroupSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNotesGroupSuccess
);

export const selectRemoveNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNoteInProgress
);

export const selectRemoveNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNoteError
);

export const selectRemoveNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNoteSuccess
);
