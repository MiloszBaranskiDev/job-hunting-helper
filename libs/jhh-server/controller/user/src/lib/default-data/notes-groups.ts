import { Note, NotesGroup } from '@jhh/shared/interfaces';

interface DefaultNote extends Pick<Note, 'name' | 'slug' | 'content'> {}

interface DefaultNotesGroup extends Pick<NotesGroup, 'name' | 'slug'> {
  notes: DefaultNote[];
}

const defaultNotesGroups: DefaultNotesGroup[] = [
  {
    name: 'Default Group 1',
    slug: 'default-group-1',
    notes: [
      {
        name: 'Default Note 1',
        slug: 'default-note-1',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 2',
        slug: 'default-note-2',
        content: 'This is a default note',
      },
    ],
  },
  {
    name: 'Default Group 2',
    slug: 'default-group-2',
    notes: [
      {
        name: 'Default Note 1',
        slug: 'default-note-1',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 2',
        slug: 'default-note-2',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 4',
        slug: 'default-note-4',
        content: 'This is a default note',
      },
      {
        name: 'Default Note 4',
        slug: 'default-note-4',
        content: 'This is a default note',
      },
    ],
  },
];

export default defaultNotesGroups;
