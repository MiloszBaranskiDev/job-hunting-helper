import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, NOTES_STATE_KEY, NotesState } from './notes.reducer';

import { Note, NotesGroup } from '@jhh/shared/interfaces';

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

export const selectAddNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNoteInProgress
);

export const selectAddNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNoteError
);

export const selectAddNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNoteSuccess
);

export const selectEditNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNoteInProgress
);

export const selectEditNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNoteError
);

export const selectEditNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNoteSuccess
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

export const selectRelatedNotes = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], props: { exclude: Note; limit: number }) => {
    const group: NotesGroup | undefined = notesGroups.find(
      (group) => group.id === props.exclude.groupId
    );

    if (!group) {
      return [];
    }

    const relatedNotes: Note[] = group.notes.filter(
      (note) => note.id !== props.exclude.id
    );

    return relatedNotes.slice(0, props.limit);
  }
);
