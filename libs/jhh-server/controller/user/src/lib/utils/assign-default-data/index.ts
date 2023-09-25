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
        orderIndex: groupIndex,
        name: defaultNotesGroups[groupIndex].name,
        slug: defaultNotesGroups[groupIndex].slug,
        userId: userId,
        notes: {
          create: defaultNotesGroups[groupIndex].notes.map(
            (note, noteIndex) => ({
              orderIndex: noteIndex,
              name: note.name,
              slug: note.slug,
              content: note.content,
            })
          ),
        },
      },
    });
  }
};

export default assignDefaultData;
