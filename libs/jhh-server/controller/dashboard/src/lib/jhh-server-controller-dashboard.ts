import { PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/enums';
import { BoardColumn, NotesGroup, User } from '@jhh/shared/interfaces';

import { JhhServerDb } from '@jhh/jhh-server/db';

export function JhhServerControllerDashboard() {
  const prisma: PrismaClient = JhhServerDb();
  const loadAssignedData = async (req: any, res: any): Promise<void> => {
    try {
      const userId = req.user.id;
      let unsavedBoardRequestId: string | null;

      const user: User | null = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (user) {
        unsavedBoardRequestId = user.unsavedBoardRequestId;
      }

      const notesGroups: NotesGroup[] = await prisma.notesGroup.findMany({
        where: {
          userId: userId,
        },
        include: {
          notes: true,
        },
      });

      const boardColumns: BoardColumn[] = await prisma.boardColumn.findMany({
        where: {
          userId: userId,
          isTemporary: false,
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          items: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      res
        .status(HttpStatusCode.OK)
        .json({ data: { notesGroups, boardColumns, unsavedBoardRequestId } });
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
