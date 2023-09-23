import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, NOTES_STATE_KEY, NotesState } from './notes.reducer';

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
  (notesGroups) => notesGroups
);
