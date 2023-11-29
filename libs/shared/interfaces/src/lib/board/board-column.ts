import { BoardColumnItem } from './board-column-item';

export interface BoardColumn {
  id: string;
  name: string;
  color: string;
  items: BoardColumnItem[];
}
