import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Note, NotesGroup } from '@jhh/shared/interfaces';

import * as NotesActions from './notes.actions';
import * as NotesSelectors from './notes.selectors';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable()
export class NotesFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  notesGroups$: Observable<NotesGroup[]> = this.store.pipe(
    select(NotesSelectors.selectAllNotes)
  );

  addNotesGroupInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupInProgress)
  );

  addNotesGroupError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupError)
  );

  addNotesGroupSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupSuccess)
  );

  removeNoteInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteInProgress)
  );

  removeNoteError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteError)
  );

  removeNoteSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteSuccess)
  );

  addNotesGroup(name: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.addNotesGroup({
        payload: { name: name },
      }),
      NotesActions.Type.AddNotesGroupSuccess,
      NotesActions.Type.AddNotesGroupFail
    );
  }

  removeNote(noteId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.removeNote({
        payload: { noteId: noteId },
      }),
      NotesActions.Type.RemoveNoteSuccess,
      NotesActions.Type.RemoveNoteFail
    );
  }

  getNotesGroup$BySlug(slug: string): Observable<NotesGroup | undefined> {
    return this.store.pipe(select(NotesSelectors.selectNotesGroupBySlug, slug));
  }

  getNote$BySlugs(
    groupSlug: string,
    noteSlug: string
  ): Observable<Note | undefined | null> {
    return this.store.pipe(
      select(NotesSelectors.selectNoteBySlugs, { groupSlug, noteSlug })
    );
  }
}
