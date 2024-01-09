import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ScheduleEvent } from '@jhh/shared/interfaces';

import * as ScheduleSelectors from './schedule.selectors';

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
}
