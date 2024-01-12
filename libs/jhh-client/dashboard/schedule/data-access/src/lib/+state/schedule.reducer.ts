import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as ScheduleActions from './schedule.actions';

import { ScheduleEvent } from '@jhh/shared/interfaces';

export const SCHEDULE_STATE_KEY = 'schedule';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
  success?: boolean;
}

export interface ScheduleState extends EntityState<ScheduleEvent> {
  addEvent: OperationState;
}

export const adapter: EntityAdapter<ScheduleEvent> =
  createEntityAdapter<ScheduleEvent>();

export const initialScheduleState: ScheduleState = adapter.getInitialState({
  addEvent: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<ScheduleState> = createReducer(
  initialScheduleState,
  on(ScheduleActions.setScheduleEvents, (state, { events }) =>
    adapter.setAll(events, state)
  ),
  on(ScheduleActions.addEvent, (state) => ({
    ...state,
    addEvent: {
      ...state.addEvent,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(ScheduleActions.addEventFail, (state, { payload }) => ({
    ...state,
    addEvent: {
      ...state.addEvent,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(ScheduleActions.addEventSuccess, (state, { payload }) => {
    return adapter.addOne(payload.addedEvent, {
      ...state,
      addEvent: {
        ...state.addEvent,
        inProgress: false,
        success: true,
        error: null,
      },
    });
  })
);

export function scheduleReducer(
  state: ScheduleState | undefined,
  action: Action
) {
  return reducer(state, action);
}
