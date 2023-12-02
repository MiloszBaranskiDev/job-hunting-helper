import { BoardColumn, PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { BoardColumnFieldsLength, HttpStatusCode } from '@jhh/shared/enums';

const addBoardColumn = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { name, color } = req.body;
    const userId = req.user.id;

    if (!name) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name is required.'
      );
    }

    if (/[\s]{2,}/.test(name)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column name cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < BoardColumnFieldsLength.MinColumnNameLength ||
      name.length > BoardColumnFieldsLength.MaxColumnNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Board column name must be between ${BoardColumnFieldsLength.MinColumnNameLength} and ${BoardColumnFieldsLength.MaxColumnNameLength} characters`
      );
    }

    if (!color) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Board column color is required.'
      );
    }

    const hexColorRegex: RegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (!hexColorRegex.test(color)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid color format. Color should be a valid hex code.'
      );
    }

    const newBoardColumn: BoardColumn = await prisma.boardColumn.create({
      data: {
        name,
        color,
        userId,
      },
      include: {
        items: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { newBoardColumn } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addBoardColumn;