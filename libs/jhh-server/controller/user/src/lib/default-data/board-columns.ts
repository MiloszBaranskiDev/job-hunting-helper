import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';

interface DefaultColumnItem
  extends Pick<BoardColumnItem, 'content' | 'order'> {}

interface DefaultBoardColumn
  extends Pick<BoardColumn, 'name' | 'color' | 'order'> {
  items: DefaultColumnItem[];
}

const defaultBoardColumns: DefaultBoardColumn[] = [
  {
    name: 'Todo',
    color: '#e55039',
    order: 0,
    items: [
      { content: 'Get to work', order: 0 },
      { content: 'Pick up groceries', order: 1 },
      { content: 'Go home', order: 2 },
      { content: 'Fall asleep', order: 3 },
    ],
  },
  {
    name: 'Done',
    color: '#6ab04c',
    order: 1,
    items: [
      { content: 'Get up', order: 0 },
      { content: 'Brush teeth', order: 1 },
      { content: 'Take a shower', order: 2 },
      { content: 'Check e-mail', order: 3 },
      { content: 'Walk dog', order: 4 },
    ],
  },
];

export default defaultBoardColumns;
