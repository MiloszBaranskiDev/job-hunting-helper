import { BoardColumn } from '@jhh/shared/interfaces';

export interface UpdateBoardColumnsPayload {
  columnsToUpdate: Partial<BoardColumn>[];
}
