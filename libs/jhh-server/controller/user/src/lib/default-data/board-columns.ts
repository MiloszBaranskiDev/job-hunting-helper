import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';

interface DefaultColumnItem extends Pick<BoardColumnItem, 'content'> {}

interface DefaultBoardColumn extends Pick<BoardColumn, 'name' | 'color'> {
  items: DefaultColumnItem[];
}

const defaultBoardColumns: DefaultBoardColumn[] = [
  {
    name: 'Todo',
    color: '#e55039',
    items: [
      { content: 'Get to work' },
      { content: 'Pick up groceries' },
      { content: 'Go home' },
      { content: 'Fall asleep' },
    ],
  },
  {
    name: 'Done',
    color: '#6ab04c',
    items: [
      { content: 'Get up' },
      { content: 'Brush teeth' },
      { content: 'Take a shower' },
      { content: 'Check e-mail' },
      { content: 'Walk dog' },
    ],
  },
];

export default defaultBoardColumns;
