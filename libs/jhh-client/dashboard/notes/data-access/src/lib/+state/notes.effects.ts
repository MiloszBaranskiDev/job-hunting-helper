import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import * as NotesActions from './notes.actions';
import { NotesFacade } from './notes.facade';
import { NotesService } from '../services/notes.service';

import {
  AddNotesGroupSuccessPayload,
  RemoveNoteSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/interfaces';
import { RemoveNoteModalService } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

@Injectable()
export class NotesEffects {
  private readonly actions$ = inject(Actions);
  private readonly notesService: NotesService = inject(NotesService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly removeNoteModalService: RemoveNoteModalService = inject(
    RemoveNoteModalService
  );
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

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
              this.snackbarService.open('Group added successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.addNotesGroupFail({ payload: error }),
      })
    )
  );

  removeNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.removeNote),
      fetch({
        run: (action) =>
          this.notesService.removeNote(action.payload).pipe(
            map((res: RemoveNoteSuccessPayload) =>
              NotesActions.removeNoteSuccess({ payload: res })
            ),
            tap(() => {
              this.removeNoteModalService.clearNoteToRemove();
              this.snackbarService.open('Note removed successfully!');
            })
          ),
        onError: (action, error) =>
          NotesActions.removeNoteFail({ payload: error }),
      })
    )
  );
}
