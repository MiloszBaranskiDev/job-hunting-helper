import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import defaultNotesGroups from '../../default-data/notes-groups';
import defaultBoardColumns from '../../default-data/board-columns';

import { BoardColumnItem } from '@jhh/shared/interfaces';

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
    let columnIndex: number = 0;
    columnIndex < defaultBoardColumns.length;
    columnIndex++
  ) {
    await prisma.boardColumn.create({
      data: {
        name: defaultBoardColumns[columnIndex].name,
        color: defaultBoardColumns[columnIndex].color,
        order: defaultBoardColumns[columnIndex].order,
        userId: userId,
        items: {
          create: defaultBoardColumns[columnIndex].items.map(
            (item: BoardColumnItem) => ({
              content: item.content,
              order: item.order,
            })
          ),
        },
      },
    });
  }
};

export default assignDefaultData;
