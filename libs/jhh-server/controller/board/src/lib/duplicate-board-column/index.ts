import { BoardColumn, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { HttpStatusCode } from '@jhh/shared/enums';
import { BoardColumn as IBoardColumn } from '@jhh/shared/interfaces';

import { JhhServerDb } from '@jhh/jhh-server/db';

const duplicateBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnId } = req.body;
    const userId = req.user.id;

    if (!columnId) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column ID is required.'
      );
    }

    const existingColumn: BoardColumn | null =
      await prisma.boardColumn.findUnique({
        where: { id: columnId },
        include: { items: true },
      });

    if (!existingColumn) {
      return respondWithError(
        res,
        HttpStatusCode.NotFound,
        'Board column not found'
      );
    }

    if (existingColumn.userId !== userId) {
      return respondWithError(
        res,
        HttpStatusCode.Unauthorized,
        'User is not the owner of the board column.'
      );
    }

    const duplicatedBoardColumnWithoutItems: BoardColumn =
      await prisma.boardColumn.create({
        data: {
          name: existingColumn.name,
          color: existingColumn.color,
          userId: userId,
        } as BoardColumn,
      });

    if (
      (existingColumn as unknown as IBoardColumn).items &&
      (existingColumn as unknown as IBoardColumn).items.length > 0
    ) {
      await Promise.all(
        (existingColumn as unknown as IBoardColumn).items.map((item) =>
          prisma.boardColumnItem.create({
            data: {
              content: item.content,
              columnId: duplicatedBoardColumnWithoutItems.id,
            },
          })
        )
      );
    }

    const duplicatedBoardColumn: BoardColumn =
      (await prisma.boardColumn.findUnique({
        where: { id: duplicatedBoardColumnWithoutItems.id },
        include: { items: true },
      })) as BoardColumn;

    res.status(HttpStatusCode.OK).json({ data: { duplicatedBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default duplicateBoardColumn;
