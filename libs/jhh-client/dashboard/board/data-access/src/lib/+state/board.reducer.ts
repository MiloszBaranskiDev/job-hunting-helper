import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as BoardActions from './board.actions';

import { BoardColumn } from '@jhh/shared/interfaces';

export const BOARD_STATE_KEY = 'board';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
  success?: boolean;
}

export interface BoardState extends EntityState<BoardColumn> {
  // addColumn: OperationState;
}

export const adapter = createEntityAdapter<BoardColumn>();

export const initialBoardState: BoardState = adapter.getInitialState({});

const reducer: ActionReducer<BoardState> = createReducer(
  initialBoardState,
  on(BoardActions.setBoard, (state, { boardColumns }) =>
    adapter.setAll(boardColumns, state)
  )
);

export function boardReducer(state: BoardState | undefined, action: Action) {
  return reducer(state, action);
}
