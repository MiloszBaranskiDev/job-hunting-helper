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
  (state: NotesState) => state.addNotesGroup.inProgress
);

export const selectAddNotesGroupError = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNotesGroup.error
);

export const selectAddNotesGroupSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNotesGroup.success
);

export const selectAddNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNote.inProgress
);

export const selectAddNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNote.error
);

export const selectAddNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.addNote.success
);

export const selectEditNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.inProgress
);

export const selectEditNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.error
);

export const selectEditNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.success
);

export const selectRemoveNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNote.inProgress
);

export const selectRemoveNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNote.error
);

export const selectRemoveNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNote.success
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
