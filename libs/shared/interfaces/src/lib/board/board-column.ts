import { BoardColumnItem } from './board-column-item';

export interface BoardColumn {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  items: {
    [range: string]: BoardColumnItem[];
  };
}
