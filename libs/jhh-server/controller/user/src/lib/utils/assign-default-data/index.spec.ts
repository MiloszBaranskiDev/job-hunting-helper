import assignDefaultData from '../assign-default-data/index';

import defaultNotesGroups from '../../default-data/notes-groups';

const prismaMock = {
  notesGroup: {
    create: jest.fn(),
  },
};

jest.mock('@jhh/jhh-server/db', () => {
  return {
    JhhServerDb: jest.fn(() => prismaMock),
  };
});

describe('assignDefaultData', () => {
  let userId: string;

  beforeEach(() => {
    userId = 'someUserId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should assign default data correctly', async () => {
    await assignDefaultData(userId);

    expect(prismaMock.notesGroup.create).toHaveBeenCalledTimes(
      defaultNotesGroups.length
    );

    defaultNotesGroups.forEach((group, groupIndex) => {
      expect(prismaMock.notesGroup.create).toHaveBeenCalledWith({
        data: {
          name: group.name,
          userId: userId,
          notes: {
            create: group.notes.map((note, noteIndex) => ({
              name: note.name,
              content: note.content,
            })),
          },
        },
      });
    });
  });
});
