import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Note, NotesGroup } from '@jhh/shared/interfaces';

import {
  selectAllNotes,
  selectNoteBySlugs,
  selectNotesGroupBySlug,
} from './notes.selectors';

@Injectable()
export class NotesFacade {
  private readonly store = inject(Store);

  notesGroups$: Observable<NotesGroup[]> = this.store.pipe(
    select(selectAllNotes)
  );

  getNotesGroup$BySlug(slug: string): Observable<NotesGroup | undefined> {
    return this.store.pipe(select(selectNotesGroupBySlug, slug));
  }

  getNote$BySlugs(
    groupSlug: string,
    noteSlug: string
  ): Observable<Note | undefined | null> {
    return this.store.pipe(select(selectNoteBySlugs, { groupSlug, noteSlug }));
  }
}
