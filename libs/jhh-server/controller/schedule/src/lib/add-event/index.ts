import { PrismaClient, ScheduleEvent } from '@prisma/client';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { EventFieldsLength, HttpStatusCode } from '@jhh/shared/enums';

import { JhhServerDb } from '@jhh/jhh-server/db';

const addEvent = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { start, end, title, color, description } = req.body;
    const userId = req.user.id;

    if (!start || !end || !title || !color) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: startDate, endDate, title, color'
      );
    }

    if (/[\s]{2,}/.test(title)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Title cannot have consecutive spaces.'
      );
    }

    if (title !== title.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Title cannot have leading or trailing spaces.'
      );
    }

    if (
      title.length < EventFieldsLength.MinTitleLength ||
      title.length > EventFieldsLength.MaxTitleLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Title must be between ${EventFieldsLength.MinTitleLength} and ${EventFieldsLength.MaxTitleLength} characters`
      );
    }

    if (
      description &&
      description.length > EventFieldsLength.MaxDescriptionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Description can have max ${EventFieldsLength.MaxDescriptionLength} characters`
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

    const startDate: Date = new Date(start);
    const endDate: Date = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid date format. Please provide valid startDate and endDate.'
      );
    }

    if (endDate <= startDate) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'endDate must be later than startDate.'
      );
    }

    const addedEvent: ScheduleEvent = await prisma.scheduleEvent.create({
      data: {
        start: startDate,
        end: endDate,
        title: title,
        color: color,
        description: description,
        userId: userId,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { addedEvent } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addEvent;