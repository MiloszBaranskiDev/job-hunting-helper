import { NotesGroup, PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { HttpStatusCode, NotesGroupFieldsLength } from '@jhh/shared/enums';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

export function JhhServerControllerNotes() {
  const prisma: PrismaClient = JhhServerDb();

  const addNotesGroup = async (req: any, res: any): Promise<void> => {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      if (!name) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Group name is required.'
        );
      }

      if (/[\s]{2,}/.test(name)) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Group name cannot have consecutive spaces.'
        );
      }

      if (name !== name.trim()) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Group name cannot have leading or trailing spaces.'
        );
      }

      if (
        name.length < NotesGroupFieldsLength.MinNotesGroupNameLength ||
        name.length > NotesGroupFieldsLength.MaxNotesGroupNameLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Group name must be between ${NotesGroupFieldsLength.MinNotesGroupNameLength} and ${NotesGroupFieldsLength.MaxNotesGroupNameLength} characters`
        );
      }

      const existingGroup: NotesGroup | null =
        await prisma.notesGroup.findUnique({
          where: { name },
        });

      if (existingGroup) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Group name already exists'
        );
      }

      let slug: string = slugify(name, { lower: true, strict: true });
      let suffix: number = 2;
      const originalSlug: string = slug;
      while (await prisma.notesGroup.findUnique({ where: { slug } })) {
        slug = `${originalSlug}-${suffix}`;
        suffix++;
      }

      const existingGroups: NotesGroup[] = await prisma.notesGroup.findMany();
      const orderIndex: number =
        existingGroups.length > 0
          ? Math.max(...existingGroups.map((group) => group.orderIndex)) + 1
          : 1;

      const newNotesGroup: NotesGroup = await prisma.notesGroup.create({
        data: {
          orderIndex,
          name,
          slug,
          userId,
        },
        include: {
          notes: true,
        },
      });

      res.status(HttpStatusCode.OK).json({ data: { newNotesGroup } });
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
    addNotesGroup,
  };
}
