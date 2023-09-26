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
    const group = notesGroups.find((group) => group.slug === props.groupSlug);
    return group
      ? group.notes.find((note) => note.slug === props.noteSlug)
      : null;
  }
);
