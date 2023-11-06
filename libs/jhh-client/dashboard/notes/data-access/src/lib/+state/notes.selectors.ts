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
  (state: NotesState) => state.addNotesGroup.success!
);

export const selectEditNotesGroupInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNotesGroup.inProgress
);

export const selectEditNotesGroupError = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNotesGroup.error
);

export const selectEditNotesGroupSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNotesGroup.success!
);

export const selectRemoveNotesGroupInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNotesGroup.inProgress
);

export const selectRemoveNotesGroupError = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNotesGroup.error
);

export const selectRemoveNotesGroupSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.removeNotesGroup.success!
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
  (state: NotesState) => state.addNote.success!
);

export const selectEditNoteInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.inProgress
);

export const selectEditNoteSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.success!
);

export const selectEditNoteError = createSelector(
  selectNotesState,
  (state: NotesState) => state.editNote.error
);

export const selectChangeNoteGroupInProgress = createSelector(
  selectNotesState,
  (state: NotesState) => state.changeNoteGroup.inProgress
);

export const selectChangeNoteGroupError = createSelector(
  selectNotesState,
  (state: NotesState) => state.changeNoteGroup.error
);

export const selectChangeNoteGroupSuccess = createSelector(
  selectNotesState,
  (state: NotesState) => state.changeNoteGroup.success!
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
  (state: NotesState) => state.removeNote.success!
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

export const selectNoteByIds = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], props: { noteId: string; groupId: string }) => {
    const group: NotesGroup | undefined = notesGroups.find(
      (group) => group.id === props.groupId
    );

    return group
      ? group.notes.find((note) => note.id === props.noteId)!.slug
      : null;
  }
);

export const selectGroupSlugByGroupId = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], props: { groupId: string }) =>
    notesGroups.find((group) => group.id === props.groupId)?.slug
);

export const selectGroupSlugByNoteId = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], props: { noteId: string }) => {
    for (const group of notesGroups) {
      for (const note of group.notes) {
        if (note.id === props.noteId) {
          return group.slug;
        }
      }
    }
    return null;
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

export const selectAllGroups = createSelector(
  selectAllNotes,
  (notesGroups: NotesGroup[], props: { excludeId: string }) => {
    return notesGroups.filter((group) => group.id !== props.excludeId);
  }
);

export const selectSearchNotes = createSelector(
  selectNotesGroups,
  (notesGroups: NotesGroup[], props: { query: string; groupId: string }) => {
    const group: NotesGroup | undefined = notesGroups.find(
      (group) => group.id === props.groupId
    );

    if (group) {
      return group.notes.filter((note) =>
        note.name.toLowerCase().includes(props.query.toLowerCase())
      );
    } else {
      return [];
    }
  }
);
