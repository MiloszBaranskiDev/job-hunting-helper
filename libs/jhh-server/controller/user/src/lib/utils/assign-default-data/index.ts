import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import defaultNotesGroups from '../../default-data/notes-groups';
import defaultBoardColumns from '../../default-data/board-columns';

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
        slug: defaultNotesGroups[groupIndex].slug,
        userId: userId,
        notes: {
          create: defaultNotesGroups[groupIndex].notes.map(
            (note, noteIndex) => ({
              name: note.name,
              slug: note.slug,
              content: note.content,
            })
          ),
        },
      },
    });
  }

  for (
    let columnIndex = 0;
    columnIndex < defaultBoardColumns.length;
    columnIndex++
  ) {
    const column = defaultBoardColumns[columnIndex];

    const createdColumn = await prisma.boardColumn.create({
      data: {
        name: column.name,
        color: column.color,
        userId: userId,
      },
    });

    for (const range in column.items) {
      const itemsInRange = column.items[range];
      for (const item of itemsInRange) {
        await prisma.boardColumnItem.create({
          data: {
            content: item.content,
            columnId: createdColumn.id,
          },
        });
      }
    }
  }
};

export default assignDefaultData;
