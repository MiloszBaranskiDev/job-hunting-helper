import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as BoardActions from './board.actions';

import { BoardColumn } from '@jhh/shared/interfaces';

export const BOARD_STATE_KEY = 'board';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
}

export interface BoardState extends EntityState<BoardColumn> {
  duplicateBoardColumn: OperationState;
  removeBoardColumn: OperationState;
}

export const adapter = createEntityAdapter<BoardColumn>();

export const initialBoardState: BoardState = adapter.getInitialState({
  duplicateBoardColumn: {
    inProgress: false,
    error: null,
  },
  removeBoardColumn: {
    inProgress: false,
    error: null,
  },
});

const reducer: ActionReducer<BoardState> = createReducer(
  initialBoardState,
  on(BoardActions.setBoard, (state, { boardColumns }) =>
    adapter.setAll(boardColumns, state)
  ),
  on(BoardActions.duplicateBoardColumn, (state) => ({
    ...state,
    duplicateBoardColumn: {
      ...state.duplicateBoardColumn,
      inProgress: true,
      error: null,
    },
  })),
  on(BoardActions.duplicateBoardColumnFail, (state, { payload }) => ({
    ...state,
    duplicateBoardColumn: {
      ...state.duplicateBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.duplicateBoardColumnSuccess, (state, { payload }) => {
    const updatedState: BoardState = adapter.addOne(
      payload.duplicatedBoardColumn,
      state
    );

    return {
      ...updatedState,
      duplicateBoardColumn: {
        inProgress: false,
        error: null,
      },
    };
  }),
  on(BoardActions.removeBoardColumn, (state) => ({
    ...state,
    removeBoardColumn: {
      ...state.removeBoardColumn,
      inProgress: true,
      error: null,
    },
  })),
  on(BoardActions.removeBoardColumnFail, (state, { payload }) => ({
    ...state,
    removeBoardColumn: {
      ...state.removeBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.removeBoardColumnSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    delete updatedEntities[payload.removedBoardColumn.id];
    const definedEntities = Object.values(updatedEntities).filter(
      (column): column is BoardColumn => column !== undefined
    );

    return adapter.setAll(definedEntities, {
      ...state,
      removeBoardColumn: {
        ...state.removeBoardColumn,
        inProgress: false,
      },
    });
  })
);

export function boardReducer(state: BoardState | undefined, action: Action) {
  return reducer(state, action);
}
