import { createAction, props } from '@ngrx/store';

import { ScheduleEvent } from '@jhh/shared/interfaces';

export enum Type {
  SetEvents = '[Schedule] Set Events',
}

export const setEvents = createAction(
  Type.SetEvents,
  props<{ events: ScheduleEvent[] }>()
);
