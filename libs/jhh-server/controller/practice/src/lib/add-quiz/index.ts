import { PrismaClient, Quiz } from '@prisma/client';
import slugify from 'slugify';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import {
  HttpStatusCode,
  QuizFieldsLength,
  QuizItemAnswer,
} from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { regex } from '@jhh/shared/regex';

const addQuiz = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    const { name, description, imageUrl, items } = req.body;
    const userId = req.user.id;

    if (!name || !items) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: name, items'
      );
    }

    if (/[\s]{2,}/.test(name)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Name cannot have consecutive spaces.'
      );
    }

    if (name !== name.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Name cannot have leading or trailing spaces.'
      );
    }

    if (
      name.length < QuizFieldsLength.MinNameLength ||
      name.length > QuizFieldsLength.MaxNameLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Name must be between ${QuizFieldsLength.MinNameLength} and ${QuizFieldsLength.MaxNameLength} characters`
      );
    }

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingQuiz) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Quiz name already exists.'
      );
    }

    if (
      description &&
      description.length > QuizFieldsLength.MaxDescriptionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Description can have max ${QuizFieldsLength.MaxDescriptionLength} characters`
      );
    }

    if (imageUrl && imageUrl.length > QuizFieldsLength.MaxImageUrlLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Image URL can have max ${QuizFieldsLength.MaxImageUrlLength} characters`
      );
    }

    if (imageUrl && !regex.imageUrl.test(imageUrl)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid image URL.'
      );
    }

    if (items.length < 1 || items.length > QuizFieldsLength.MaxQuestions) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Number of questions must be between 1 and ${QuizFieldsLength.MaxQuestions}`
      );
    }

    for (const item of items) {
      if (
        item.question.length < QuizFieldsLength.MinQuestionLength ||
        item.question.length > QuizFieldsLength.MaxQuestionLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Each question name must be between ${QuizFieldsLength.MinQuestionLength} and ${QuizFieldsLength.MaxQuestionLength} characters`
        );
      }

      if (
        item.answers.length < QuizFieldsLength.MinAnswers ||
        item.answers.length > QuizFieldsLength.MaxAnswers
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Each question must have between ${QuizFieldsLength.MinAnswers} and ${QuizFieldsLength.MaxAnswers} answers`
        );
      }

      const correctAnswers = item.answers.filter(
        (a: QuizItemAnswer) => a.isCorrect
      ).length;
      if (correctAnswers === 0 || correctAnswers === item.answers.length) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Each question must have at least one correct and one incorrect answer'
        );
      }

      const answerTexts = item.answers.map((a: QuizItemAnswer) =>
        a.text.trim().toLowerCase()
      );
      const uniqueAnswers = new Set(answerTexts);

      if (answerTexts.length !== uniqueAnswers.size) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Each question must have unique answers'
        );
      }

      for (const answer of item.answers) {
        if (
          answer.text.length < QuizFieldsLength.MinAnswerLength ||
          answer.text.length > QuizFieldsLength.MaxAnswerLength
        ) {
          return respondWithError(
            res,
            HttpStatusCode.BadRequest,
            `Each answer must be between ${QuizFieldsLength.MinAnswerLength} and ${QuizFieldsLength.MaxAnswerLength} characters`
          );
        }
      }
    }

    let slug: string = slugify(name, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = slug;

    while (await prisma.quiz.findFirst({ where: { slug, userId } })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const addedQuiz: Quiz = await prisma.quiz.create({
      data: {
        name: name,
        slug: slug,
        description: description,
        imageUrl: imageUrl,
        items: items,
        userId: userId,
      },
      include: {
        results: true,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { addedQuiz } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addQuiz;
