import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ScheduleEvent } from '@jhh/shared/interfaces';

import * as ScheduleSelectors from './schedule.selectors';
import * as ScheduleActions from './schedule.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class ScheduleFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  events$: Observable<ScheduleEvent[]> = this.store.pipe(
    select(ScheduleSelectors.selectEvents)
  );

  addEventInProgress$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventInProgress)
  );

  addEventError$: Observable<string | null> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventError)
  );

  addEventSuccess$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventSuccess)
  );

  addEvent(
    start: Date,
    end: Date,
    title: string,
    color: string,
    description: string | undefined
  ) {
    return this.actionResolverService.executeAndWatch(
      ScheduleActions.addEvent({
        payload: {
          start,
          end,
          title,
          color,
          description,
        },
      }),
      ScheduleActions.Type.AddEventSuccess,
      ScheduleActions.Type.AddEventFail
    );
  }

  getEvent$ById(eventId: string): Observable<ScheduleEvent | undefined> {
    return this.store.pipe(select(ScheduleSelectors.selectEventById, eventId));
  }
}
