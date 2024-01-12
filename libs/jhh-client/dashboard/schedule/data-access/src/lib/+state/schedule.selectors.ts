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

export const selectAddEventInProgress = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.inProgress
);

export const selectAddEventError = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.error
);

export const selectAddEventSuccess = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.success!
);
