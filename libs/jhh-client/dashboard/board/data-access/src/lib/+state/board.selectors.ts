import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, BOARD_STATE_KEY, BoardState } from './board.reducer';

import { BoardColumn } from '@jhh/shared/interfaces';

export const selectBoardState =
  createFeatureSelector<BoardState>(BOARD_STATE_KEY);

export const {
  selectIds: selectColumnIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllColumns,
  selectTotal: selectTotalColumns,
} = adapter.getSelectors(selectBoardState);

export const selectBoardColumns = createSelector(
  selectAllColumns,
  (boardColumns: BoardColumn[]) => boardColumns
);

export const selectDuplicateBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.duplicateBoardColumn.inProgress
);

export const selectDuplicateBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.duplicateBoardColumn.error
);

export const selectRemoveBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.removeBoardColumn.inProgress
);

export const selectRemoveBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.removeBoardColumn.error
);
