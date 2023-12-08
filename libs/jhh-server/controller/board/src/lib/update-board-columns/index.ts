import { BoardColumn, PrismaClient } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { BoardColumnFieldsLength, HttpStatusCode } from '@jhh/shared/enums';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { BoardColumnItem } from '@jhh/shared/interfaces';

const updateBoardColumns = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { columnsToUpdate } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(columnsToUpdate)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid input format: columnsToUpdate should be an array.'
      );
    }

    const allUpdatedItemIds: string[] = columnsToUpdate.flatMap((column) =>
      column.items.map((item: BoardColumnItem) => item.id)
    );

    for (const column of columnsToUpdate) {
      const existingColumn: BoardColumn | null =
        await prisma.boardColumn.findUnique({
          where: { id: column.id },
          include: {
            items: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        });

      if (!existingColumn) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          `Board column with ID ${column.id} not found.`
        );
      }

      if (existingColumn.userId !== userId) {
        return respondWithError(
          res,
          HttpStatusCode.Unauthorized,
          'User is not the owner of the board column.'
        );
      }

      if (existingColumn.isTemporary) {
        let maxOrder: number = 0;
        const targetColumn = await prisma.boardColumn.findUnique({
          where: { id: column.id },
          include: {
            items: true,
          },
        });
        if (targetColumn && targetColumn.items.length > 0) {
          maxOrder = Math.max(...targetColumn.items.map((item) => item.order));
        }

        for (const item of column.items) {
          maxOrder++;
          await prisma.boardColumnItem.update({
            where: { id: item.id },
            data: {
              content: item.content,
              columnId: column.id,
              order: maxOrder,
            },
          });
        }
      } else {
        for (const item of column.items) {
          if (
            item.content.length > BoardColumnFieldsLength.MaxColumnItemLength
          ) {
            return respondWithError(
              res,
              HttpStatusCode.BadRequest,
              `Content too long for item with ID ${item.id}. Maximum length is ${BoardColumnFieldsLength.MaxColumnItemLength} characters.`
            );
          }

          if (item.id.startsWith('temp-')) {
            await prisma.boardColumnItem.create({
              data: {
                content: item.content,
                columnId: column.id,
                order: item.order,
              },
            });
          } else {
            await prisma.boardColumnItem.update({
              where: { id: item.id },
              data: {
                content: item.content,
                columnId: column.id,
                order: item.order,
              },
            });
          }
        }
      }

      // @ts-ignore
      const existingItemIds = existingColumn['items'].map((item) => item.id);
      const itemsToDelete = existingItemIds.filter(
        (id: string) => !allUpdatedItemIds.includes(id)
      );

      for (const itemId of itemsToDelete) {
        await prisma.boardColumnItem.delete({
          where: { id: itemId },
        });
      }
    }

    const tempColumns: BoardColumn[] = await prisma.boardColumn.findMany({
      where: { userId: userId, isTemporary: true },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    for (const tempColumn of tempColumns) {
      // @ts-ignore
      if (tempColumn['items'].length === 0) {
        await prisma.boardColumn.delete({
          where: { id: tempColumn.id },
        });
      }
    }

    const updatedColumns: BoardColumn[] = await prisma.boardColumn.findMany({
      where: { id: { in: columnsToUpdate.map((c) => c.id) } },
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { updatedColumns } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default updateBoardColumns;
