import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';

import * as PracticeActions from './practice.actions';
import { PracticeService } from '../services/practice/practice.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import { RemoveQuizSuccessPayload } from '@jhh/jhh-client/dashboard/practice/domain';

@Injectable()
export class PracticeEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly practiceService: PracticeService = inject(PracticeService);

  removeQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PracticeActions.removeQuiz),
      fetch({
        run: (action) =>
          this.practiceService.removeQuiz(action.payload).pipe(
            mergeMap((res: RemoveQuizSuccessPayload) => [
              PracticeActions.removeQuizSuccess({ payload: res }),
              PracticeActions.resetRemoveQuizSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Practice quiz removed successfully!');
            })
          ),
        onError: (action, error) =>
          PracticeActions.removeQuizFail({ payload: error }),
      })
    )
  );
}
