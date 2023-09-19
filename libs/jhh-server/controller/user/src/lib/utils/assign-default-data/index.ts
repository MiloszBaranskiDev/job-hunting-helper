import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import defaultNotesGroups from '../../default-data/notes-groups';

const assignDefaultData = async (userId: string): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  for (
    let groupIndex: number = 0;
    groupIndex < defaultNotesGroups.length;
    groupIndex++
  ) {
    await prisma.notesGroup.create({
      data: {
        name: defaultNotesGroups[groupIndex].name,
        userId: userId,
        orderIndex: groupIndex,
        notes: {
          create: defaultNotesGroups[groupIndex].notes.map(
            (note, noteIndex) => ({
              name: note.name,
              content: note.content,
              orderIndex: noteIndex,
            })
          ),
        },
      },
    });
  }
};

export default assignDefaultData;
