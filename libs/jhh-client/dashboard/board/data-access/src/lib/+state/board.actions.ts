import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { BoardColumn } from '@jhh/shared/interfaces';
import {
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
} from '@jhh/jhh-client/dashboard/board/domain';

export enum Type {
  SetBoard = '[Board] Set Board',
  RemoveBoardColumn = '[Board] Remove Board Column',
  RemoveBoardColumnFail = '[Board] Remove Board Column Fail',
  RemoveBoardColumnSuccess = '[Board] Remove Board Column Success',
}

export const setBoard = createAction(
  Type.SetBoard,
  props<{ boardColumns: BoardColumn[] }>()
);

export const removeBoardColumn = createAction(
  Type.RemoveBoardColumn,
  props<{ payload: RemoveBoardColumnPayload }>()
);

export const removeBoardColumnFail = createAction(
  Type.RemoveBoardColumnFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeBoardColumnSuccess = createAction(
  Type.RemoveBoardColumnSuccess,
  props<{ payload: RemoveBoardColumnSuccessPayload }>()
);
