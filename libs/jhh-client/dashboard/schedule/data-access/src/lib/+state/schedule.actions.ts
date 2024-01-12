import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { ScheduleEvent } from '@jhh/shared/interfaces';
import {
  AddEventPayload,
  AddEventSuccessPayload,
} from '@jhh/jhh-client/dashboard/schedule/domain';

export enum Type {
  SetScheduleEvents = '[Schedule] Set Schedule Events',
  AddEvent = '[Schedule] Add Event',
  AddEventFail = '[Schedule] Add Event Fail',
  AddEventSuccess = '[Schedule] Add Event Success',
  ResetAddEventSuccess = '[Schedule] Reset Add Event Success',
}

export const setScheduleEvents = createAction(
  Type.SetScheduleEvents,
  props<{ events: ScheduleEvent[] }>()
);

export const addEvent = createAction(
  Type.AddEvent,
  props<{ payload: AddEventPayload }>()
);

export const addEventFail = createAction(
  Type.AddEventFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addEventSuccess = createAction(
  Type.AddEventSuccess,
  props<{ payload: AddEventSuccessPayload }>()
);

export const resetAddEventSuccess = createAction(Type.ResetAddEventSuccess);
