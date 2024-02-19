import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map, retryWhen, switchMap, take, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';
import { of, timer } from 'rxjs';

import * as DashboardActions from './dashboard.actions';
import { DashboardFacade } from './dashboard.facade';
import { DashboardService } from '../services/dashboard/dashboard.service';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/domain';
import { LocalStorageKey } from '@jhh/shared/domain';

@Injectable()
export class DashboardEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly dashboardService: DashboardService =
    inject(DashboardService);
  private readonly dashboardFacade: DashboardFacade = inject(DashboardFacade);

  loadAssignedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAssignedData),
      fetch({
        run: () => {
          const unsavedBoardRequestId: string | null = localStorage.getItem(
            LocalStorageKey.UnsavedBoardRequestId
          );
          const ERROR_MESSAGE: string = 'Board update still pending';

          return this.dashboardService.loadAssignedData().pipe(
            map((res: LoadAssignedDataSuccessPayload) => {
              if (
                unsavedBoardRequestId?.length &&
                res.unsavedBoardRequestId !== unsavedBoardRequestId
              ) {
                throw new Error(ERROR_MESSAGE);
              }
              return DashboardActions.loadAssignedDataSuccess({ payload: res });
            }),
            retryWhen((errors) =>
              errors.pipe(
                delay(1500),
                take(10),
                switchMap((error) => {
                  if (error.message === ERROR_MESSAGE) {
                    return timer(1500);
                  }
                  return of(error);
                })
              )
            ),
            tap((val) => {
              this.dashboardFacade.setData(val);
              localStorage.removeItem(LocalStorageKey.UnsavedBoardRequestId);
            })
          );
        },
        onError: (action, error) => {
          return DashboardActions.loadAssignedDataFail({ payload: error });
        },
      })
    )
  );
}
