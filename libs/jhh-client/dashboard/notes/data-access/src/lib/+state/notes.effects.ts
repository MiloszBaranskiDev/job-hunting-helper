import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import * as NotesActions from './notes.actions';
import { NotesFacade } from './notes.facade';
import { NotesService } from '../services/notes.service';

import { AddNotesGroupSuccessPayload } from '@jhh/jhh-client/dashboard/notes/interfaces';

@Injectable()
export class NotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly notesService: NotesService = inject(NotesService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  addNotesGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.addNotesGroup),
      fetch({
        run: (action) =>
          this.notesService.addNotesGroup(action.payload).pipe(
            map((res: AddNotesGroupSuccessPayload) =>
              NotesActions.addNotesGroupSuccess({ payload: res })
            ),
            tap(() => {
              this.notesFacade.setAddNotesGroupSuccess();
            })
          ),
        onError: (action, error) =>
          NotesActions.addNotesGroupFail({ payload: error }),
      })
    )
  );
}
