import { PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/enums';
import { BoardColumn, NotesGroup } from '@jhh/shared/interfaces';

import { JhhServerDb } from '@jhh/jhh-server/db';

export function JhhServerControllerDashboard() {
  const prisma: PrismaClient = JhhServerDb();
  const loadAssignedData = async (req: any, res: any): Promise<void> => {
    try {
      const notesGroups: NotesGroup[] = await prisma.notesGroup.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          notes: true,
        },
      });

      const boardColumns: BoardColumn[] = (await prisma.boardColumn.findMany({
        where: { userId: req.user.id },
        include: { items: true },
      })) as unknown as BoardColumn[];

      const processedBoardColumns = boardColumns.map((column) => {
        const firstRange: string = '0-24';
        const itemsInFirstRange = column['items' as any].slice(0, 24);

        return {
          ...column,
          items: { [firstRange]: itemsInFirstRange },
        };
      });

      res
        .status(HttpStatusCode.OK)
        .json({ data: { notesGroups, boardColumns: processedBoardColumns } });
    } catch (error) {
      console.error(error);
      return respondWithError(
        res,
        HttpStatusCode.InternalServerError,
        'Internal Server Error'
      );
    }
  };

  return {
    loadAssignedData,
  };
}
