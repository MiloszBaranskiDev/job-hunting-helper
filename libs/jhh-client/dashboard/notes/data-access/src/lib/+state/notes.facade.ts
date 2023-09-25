import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NotesGroup } from '@jhh/shared/interfaces';

import { selectAllNotes, selectNotesGroupBySlug } from './notes.selectors';

@Injectable()
export class NotesFacade {
  private readonly store = inject(Store);

  notesGroups$: Observable<NotesGroup[]> = this.store.pipe(
    select(selectAllNotes)
  );

  getNotesGroup$BySlug(slug: string): Observable<NotesGroup | undefined> {
    return this.store.pipe(select(selectNotesGroupBySlug, slug));
  }
}
