import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';

interface DefaultColumnItem
  extends Pick<BoardColumnItem, 'content' | 'order'> {}

interface DefaultBoardColumn extends Pick<BoardColumn, 'name' | 'color'> {
  items: DefaultColumnItem[];
}

const defaultBoardColumns: DefaultBoardColumn[] = [
  {
    name: 'Todo',
    color: '#e55039',
    items: [
      { content: 'Get to work', order: 1 },
      { content: 'Pick up groceries', order: 2 },
      { content: 'Go home', order: 3 },
      { content: 'Fall asleep', order: 4 },
    ],
  },
  {
    name: 'Done',
    color: '#6ab04c',
    items: [
      { content: 'Get up', order: 1 },
      { content: 'Brush teeth', order: 2 },
      { content: 'Take a shower', order: 3 },
      { content: 'Check e-mail', order: 4 },
      { content: 'Walk dog', order: 5 },
    ],
  },
];

export default defaultBoardColumns;
