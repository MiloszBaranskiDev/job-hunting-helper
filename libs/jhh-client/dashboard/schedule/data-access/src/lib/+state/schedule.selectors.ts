import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, SCHEDULE_STATE_KEY, ScheduleState } from './schedule.reducer';

import { ScheduleEvent } from '@jhh/shared/interfaces';

export const selectScheduleState =
  createFeatureSelector<ScheduleState>(SCHEDULE_STATE_KEY);

export const {
  selectIds: selectEventsIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllEvents,
  selectTotal: selectTotalEvents,
} = adapter.getSelectors(selectScheduleState);

export const selectEvents = createSelector(
  selectAllEvents,
  (events: ScheduleEvent[]) => events
);
