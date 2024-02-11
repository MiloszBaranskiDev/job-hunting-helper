import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as DashboardSelectors from './dashboard.selectors';
import * as DashboardActions from './dashboard.actions';
import { saveToken, setUser } from '@jhh/jhh-client/auth/data-access';
import { setNotes } from '@jhh/jhh-client/dashboard/notes/data-access';
import { setBoard } from '@jhh/jhh-client/dashboard/board/data-access';
import {
  loadExchangeRates,
  setOffers,
} from '@jhh/jhh-client/dashboard/offers/data-access';
import { setScheduleEvents } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/domain';
import { setPracticeQuizzes } from '@jhh/jhh-client/dashboard/practice/data-access';

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

  loadAssignedDataSuccess$: Observable<boolean> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataSuccess)
  );

  loadAssignedData() {
    return this.actionResolverService.executeAndWatch(
      DashboardActions.loadAssignedData(),
      DashboardActions.Type.LoadAssignedDataSuccess,
      DashboardActions.Type.LoadAssignedDataFail
    );
  }

  setData(data: { payload: LoadAssignedDataSuccessPayload }): void {
    this.store.dispatch(loadExchangeRates());
    this.store.dispatch(setUser({ user: data.payload.user }));
    this.store.dispatch(
      saveToken({ payload: { token: data.payload.newToken } })
    );
    this.store.dispatch(setNotes({ notesGroups: data.payload.notesGroups }));
    this.store.dispatch(setBoard({ boardColumns: data.payload.boardColumns }));
    this.store.dispatch(setOffers({ offers: data.payload.offers }));
    this.store.dispatch(
      setScheduleEvents({ events: data.payload.scheduleEvents })
    );
    this.store.dispatch(
      setPracticeQuizzes({ quizzes: data.payload.practiceQuizzes })
    );
  }
}
