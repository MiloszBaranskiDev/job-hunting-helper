import { BoardColumnItem } from '@jhh/shared/interfaces';

export interface DuplicateBoardColumnPayload {
  columnId: string;
  items: BoardColumnItem[];
}
