interface DefaultNote {
  name: string;
  content: string;
}

interface DefaultNotesGroup {
  name: string;
  notes: DefaultNote[];
}

const defaultNotesGroups: DefaultNotesGroup[] = [
  {
    name: 'Default Group 1',
    notes: [
      {
        name: 'Default Note 1',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 2',
        content: 'This is a default note',
      },
    ],
  },
  {
    name: 'Default Group 2',
    notes: [
      {
        name: 'Default Note 1',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 2',
        content: 'This is a default note',
      },
    ],
  },
];

export default defaultNotesGroups;
