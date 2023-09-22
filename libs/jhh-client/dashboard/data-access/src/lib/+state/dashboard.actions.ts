import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/interfaces';

export enum Type {
  LoadAssignedData = '[Dashboard] LoadAssignedData',
  LoadAssignedDataFail = '[Dashboard] LoadAssignedData Fail',
  LoadAssignedDataSuccess = '[Dashboard] LoadAssignedData Success',
}

export const loadAssignedData = createAction(Type.LoadAssignedData);

export const loadAssignedDataFail = createAction(
  Type.LoadAssignedDataFail,
  props<{ payload: HttpErrorResponse }>()
);

export const loadAssignedDataSuccess = createAction(
  Type.LoadAssignedDataSuccess,
  props<{ payload: LoadAssignedDataSuccessPayload }>()
);
