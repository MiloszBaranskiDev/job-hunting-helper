import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import * as BoardActions from './board.actions';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import { RemoveBoardColumnSuccessPayload } from '@jhh/jhh-client/dashboard/board/domain';

import { BoardService } from '../services/board.service';

@Injectable()
export class BoardEffects {
  private readonly actions$ = inject(Actions);
  private readonly boardService: BoardService = inject(BoardService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  removeBoardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.removeBoardColumn),
      fetch({
        run: (action) =>
          this.boardService.removeBoardColumn(action.payload).pipe(
            map((res: RemoveBoardColumnSuccessPayload) =>
              BoardActions.removeBoardColumnSuccess({ payload: res })
            ),
            tap(() => {
              this.snackbarService.open('Column removed successfully!');
            })
          ),
        onError: (action, error) =>
          BoardActions.removeBoardColumnFail({ payload: error }),
      })
    )
  );
}
