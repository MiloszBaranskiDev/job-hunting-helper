import { createAction, props } from '@ngrx/store';

import { BoardColumn } from '@jhh/shared/interfaces';

export enum Type {
  SetBoard = '[Board] Set Board',
}

export const setBoard = createAction(
  Type.SetBoard,
  props<{ boardColumns: BoardColumn[] }>()
);
