import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  delay,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  take,
} from 'rxjs/operators';
import { fetch } from '@nrwl/angular';
import { from, of, timer } from 'rxjs';

import * as DashboardActions from './dashboard.actions';
import { DashboardFacade } from './dashboard.facade';
import { DashboardService } from '../services/dashboard.service';

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
          return this.dashboardService.loadAssignedData().pipe(
            map((res: LoadAssignedDataSuccessPayload) => {
              const unsavedBoardRequestId: string | null = localStorage.getItem(
                LocalStorageKey.UnsavedBoardRequestId
              );
              if (
                unsavedBoardRequestId?.length &&
                res.unsavedBoardRequestId !== unsavedBoardRequestId
              ) {
                throw new Error('Board update still pending');
              }
              return res;
            }),
            retryWhen((errors) =>
              errors.pipe(
                delay(1500),
                take(10),
                switchMap((error) => {
                  if (error.message === 'Board update still pending') {
                    return timer(1500);
                  }
                  return of(error);
                })
              )
            ),
            mergeMap((res) => {
              this.dashboardFacade.setData({ payload: res });
              localStorage.removeItem(LocalStorageKey.UnsavedBoardRequestId);
              return from([
                DashboardActions.loadAssignedDataSuccess({ payload: res }),
                DashboardActions.resetLoadAssignedDataSuccess(),
              ]);
            }),
            catchError((error) => {
              return of(
                DashboardActions.loadAssignedDataFail({ payload: error })
              );
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
