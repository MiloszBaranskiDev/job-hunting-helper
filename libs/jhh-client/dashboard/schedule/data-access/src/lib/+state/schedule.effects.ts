import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import { mergeMap, tap } from 'rxjs/operators';

import * as ScheduleActions from './schedule.actions';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { ScheduleService } from '../services/schedule/schedule.service';

import {
  AddEventSuccessPayload,
  RemoveEventSuccessPayload,
} from '@jhh/jhh-client/dashboard/schedule/domain';

@Injectable()
export class ScheduleEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly scheduleService: ScheduleService = inject(ScheduleService);

  addEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addEvent),
      fetch({
        run: (action) =>
          this.scheduleService.addEvent(action.payload).pipe(
            mergeMap((res: AddEventSuccessPayload) => [
              ScheduleActions.addEventSuccess({ payload: res }),
              ScheduleActions.resetAddEventSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Schedule event added successfully!');
            })
          ),
        onError: (action, error) =>
          ScheduleActions.addEvent({ payload: error }),
      })
    )
  );

  removeEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.removeEvent),
      fetch({
        run: (action) =>
          this.scheduleService.removeEvent(action.payload).pipe(
            mergeMap((res: RemoveEventSuccessPayload) => [
              ScheduleActions.removeEventSuccess({ payload: res }),
              ScheduleActions.resetRemoveEventSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Schedule event removed successfully!');
            })
          ),
        onError: (action, error) =>
          ScheduleActions.removeEventFail({ payload: error }),
      })
    )
  );
}
