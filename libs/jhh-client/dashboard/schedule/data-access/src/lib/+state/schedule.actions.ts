import { createAction, props } from '@ngrx/store';

import { ScheduleEvent } from '@jhh/shared/interfaces';

export enum Type {
  SetScheduleEvents = '[Schedule] Set Schedule Events',
}

export const setScheduleEvents = createAction(
  Type.SetScheduleEvents,
  props<{ events: ScheduleEvent[] }>()
);
