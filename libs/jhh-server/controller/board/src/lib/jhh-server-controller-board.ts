import addBoardColumn from './add-board-column';
import duplicateBoardColumn from './duplicate-board-column';
import removeBoardColumn from './remove-board-column/index';

export function JhhServerControllerBoard() {
  return {
    addBoardColumn,
    duplicateBoardColumn,
    removeBoardColumn,
  };
}
