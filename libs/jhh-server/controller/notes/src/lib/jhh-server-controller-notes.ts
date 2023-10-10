import { Note, NotesGroup, PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { JhhServerDb } from '@jhh/jhh-server/db';

import {
  HttpStatusCode,
  NoteFieldsLength,
  NotesGroupFieldsLength,
  NoteSize,
} from '@jhh/shared/enums';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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

  const addNote = async (req: any, res: any): Promise<void> => {
    try {
      let { name, content, groupId } = req.body;
      const userId = req.user.id;

      if (!name) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Note name is required.'
        );
      }

      if (!groupId) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Group ID is required.'
        );
      }

      if (/[\s]{2,}/.test(name)) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Note name cannot have consecutive spaces.'
        );
      }

      if (name !== name.trim()) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Note name cannot have leading or trailing spaces.'
        );
      }

      if (
        name.length < NoteFieldsLength.MinNameLength ||
        name.length > NoteFieldsLength.MaxNameLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Note name must be between ${NoteFieldsLength.MinNameLength} and ${NoteFieldsLength.MaxNameLength} characters`
        );
      }

      const notesGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
        where: { id: groupId },
      });

      if (!notesGroup) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          'Group of note not found'
        );
      }

      if (notesGroup.userId !== userId) {
        return respondWithError(
          res,
          HttpStatusCode.Unauthorized,
          'User is not the owner of the notes group'
        );
      }

      if (content && Buffer.from(content).length > NoteSize.MaxNoteSize) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Note content exceeds the maximum allowed size of ${
            NoteSize.MaxNoteSize / (1024 * 1024)
          } MB.`
        );
      }

      let slug: string = slugify(name, { lower: true, strict: true });
      let suffix: number = 2;
      const originalSlug: string = slug;
      while (await prisma.note.findFirst({ where: { slug, groupId } })) {
        slug = `${originalSlug}-${suffix}`;
        suffix++;
      }

      const existingNotesInGroup: Note[] = await prisma.note.findMany({
        where: { groupId },
      });

      const orderIndex: number =
        existingNotesInGroup.length > 0
          ? Math.max(...existingNotesInGroup.map((note) => note.orderIndex)) + 1
          : 1;

      content = DOMPurify.sanitize(content, domPurifyConfig);

      const newNote: Note = await prisma.note.create({
        data: {
          orderIndex,
          name,
          slug,
          content,
          groupId,
        },
      });

      res.status(HttpStatusCode.OK).json({ data: { newNote } });
    } catch (error) {
      console.error(error);
      return respondWithError(
        res,
        HttpStatusCode.InternalServerError,
        'Internal Server Error'
      );
    }
  };

  const removeNote = async (req: any, res: any): Promise<void> => {
    try {
      const { noteId } = req.query;
      const userId = req.user.id;

      if (!noteId) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Note ID is required.'
        );
      }

      const note = await prisma.note.findUnique({
        where: { id: noteId },
        select: {
          groupId: true,
        },
      });

      if (!note) {
        return respondWithError(res, HttpStatusCode.NotFound, 'Note not found');
      }

      const notesGroup: NotesGroup | null = await prisma.notesGroup.findUnique({
        where: { id: note.groupId },
      });

      if (!notesGroup) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          'Group of note not found'
        );
      }

      if (notesGroup.userId !== userId) {
        return respondWithError(
          res,
          HttpStatusCode.Unauthorized,
          'User is not the owner of the notes group'
        );
      }

      const removedNote: Note = await prisma.note.delete({
        where: { id: noteId },
      });

      res.status(HttpStatusCode.OK).json({ data: { removedNote } });
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
    addNote,
    removeNote,
  };
}