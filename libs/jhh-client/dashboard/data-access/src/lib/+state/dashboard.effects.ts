import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';

import * as DashboardActions from './dashboard.actions';
import { DashboardService } from '../services/dashboard.service';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/interfaces';

@Injectable()
export class DashboardEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly dashboardService: DashboardService =
    inject(DashboardService);

  loadAssignedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAssignedData),
      fetch({
        run: () =>
          this.dashboardService.loadAssignedData().pipe(
            map((res: LoadAssignedDataSuccessPayload) =>
              DashboardActions.loadAssignedDataSuccess({ payload: res })
            ),
            tap((val) => {
              this.dashboardService.setData(val);
            })
          ),
        onError: (action, error) =>
          DashboardActions.loadAssignedDataFail({ payload: error }),
      })
    )
  );
}
