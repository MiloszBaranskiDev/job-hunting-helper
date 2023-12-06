import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { BoardColumn } from '@jhh/shared/interfaces';
import {
  AddBoardColumnPayload,
  AddBoardColumnSuccessPayload,
  DuplicateBoardColumnPayload,
  DuplicateBoardColumnSuccessPayload,
  EditBoardColumnPayload,
  EditBoardColumnSuccessPayload,
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
  UpdateBoardColumnsPayload,
  UpdateBoardColumnsSuccessPayload,
} from '@jhh/jhh-client/dashboard/board/domain';

export enum Type {
  SetBoard = '[Board] Set Board',
  AddBoardColumn = '[Board] Add Board Column',
  AddBoardColumnFail = '[Board] Add Board Column Fail',
  AddBoardColumnSuccess = '[Board] Add Board Column Success',
  EditBoardColumn = '[Board] Edit Board Column',
  EditBoardColumnFail = '[Board] Edit Board Column Fail',
  EditBoardColumnSuccess = '[Board] Edit Board Column Success',
  ResetEditBoardColumnSuccess = '[Board] Reset Edit Board Column Success',
  DuplicateBoardColumn = '[Board] Duplicate Board Column',
  DuplicateBoardColumnFail = '[Board] Duplicate Board Column Fail',
  DuplicateBoardColumnSuccess = '[Board] Duplicate Board Column Success',
  RemoveBoardColumn = '[Board] Remove Board Column',
  RemoveBoardColumnFail = '[Board] Remove Board Column Fail',
  RemoveBoardColumnSuccess = '[Board] Remove Board Column Success',
  UpdateBoardColumns = '[Board] Update Board Columns',
  UpdateBoardColumnsFail = '[Board] Update Board Columns Fail',
  UpdateBoardColumnsSuccess = '[Board] Update Board Columns Success',
  ResetUpdateBoardColumnsSuccess = '[Board] Reset Update Board Columns Success',
}

export const setBoard = createAction(
  Type.SetBoard,
  props<{ boardColumns: BoardColumn[] }>()
);

export const addBoardColumn = createAction(
  Type.AddBoardColumn,
  props<{ payload: AddBoardColumnPayload }>()
);

export const addBoardColumnFail = createAction(
  Type.AddBoardColumnFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addBoardColumnSuccess = createAction(
  Type.AddBoardColumnSuccess,
  props<{ payload: AddBoardColumnSuccessPayload }>()
);

export const editBoardColumn = createAction(
  Type.EditBoardColumn,
  props<{ payload: EditBoardColumnPayload }>()
);

export const editBoardColumnFail = createAction(
  Type.EditBoardColumnFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editBoardColumnSuccess = createAction(
  Type.EditBoardColumnSuccess,
  props<{ payload: EditBoardColumnSuccessPayload }>()
);

export const resetEditBoardColumnSuccess = createAction(
  Type.ResetEditBoardColumnSuccess
);

export const duplicateBoardColumn = createAction(
  Type.DuplicateBoardColumn,
  props<{ payload: DuplicateBoardColumnPayload }>()
);

export const duplicateBoardColumnFail = createAction(
  Type.DuplicateBoardColumnFail,
  props<{ payload: HttpErrorResponse }>()
);

export const duplicateBoardColumnSuccess = createAction(
  Type.DuplicateBoardColumnSuccess,
  props<{ payload: DuplicateBoardColumnSuccessPayload }>()
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

export const updateBoardColumns = createAction(
  Type.UpdateBoardColumns,
  props<{ payload: UpdateBoardColumnsPayload }>()
);

export const updateBoardColumnsFail = createAction(
  Type.UpdateBoardColumnsFail,
  props<{ payload: HttpErrorResponse }>()
);

export const updateBoardColumnsSuccess = createAction(
  Type.UpdateBoardColumnsSuccess,
  props<{ payload: UpdateBoardColumnsSuccessPayload }>()
);

export const resetUpdateBoardColumnsSuccess = createAction(
  Type.ResetUpdateBoardColumnsSuccess
);
