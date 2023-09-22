import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as DashboardSelectors from './dashboard.selectors';
import * as DashboardActions from './dashboard.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable()
export class DashboardFacade {
  private readonly store: Store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  loadAssignedDataInProgress$: Observable<boolean> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataInProgress)
  );

  loadAssignedDataError$: Observable<string | null> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataError)
  );

  loadAssignedData() {
    return this.actionResolverService.executeAndWatch(
      DashboardActions.loadAssignedData(),
      DashboardActions.Type.LoadAssignedDataSuccess,
      DashboardActions.Type.LoadAssignedDataFail
    );
  }
}
