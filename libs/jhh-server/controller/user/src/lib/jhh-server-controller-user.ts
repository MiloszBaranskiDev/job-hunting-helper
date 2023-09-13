import { PrismaClient } from '@prisma/client';

import { JhhServerDb } from '@jhh/jhh-server/db';

import createJWT from './utils/create-jwt';
import hashPassword from './utils/hash-password';
import validateUserPassword from './utils/validate-user-password/index';
import { respondWithError } from '@jhh/jhh-server/shared/utils';

import { User } from '@jhh/shared/interfaces';
import { HttpStatusCode, RegisterFieldsLength } from '@jhh/shared/enums';

export function JhhServerControllerUser() {
  const prisma: PrismaClient = JhhServerDb();

  const register = async (req, res): Promise<void> => {
    try {
      const { username, password, confirmPassword } = req.body;

      if (!username || !password || !confirmPassword) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'All fields are required.'
        );
      }

      if (/\s/.test(username)) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Username should not contain whitespace'
        );
      }

      if (/\s/.test(password)) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Password should not contain whitespace'
        );
      }

      if (
        username.length < RegisterFieldsLength.MinUsernameLength ||
        username.length > RegisterFieldsLength.MaxUsernameLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`
        );
      }

      if (
        password.length < RegisterFieldsLength.MinPasswordLength ||
        password.length > RegisterFieldsLength.MaxPasswordLength
      ) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`
        );
      }

      if (password !== confirmPassword) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Passwords do not match'
        );
      }

      const existingUser: User = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (existingUser) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Username already exists'
        );
      }

      const user: User = await prisma.user.create({
        data: {
          username: username,
          password: await hashPassword(password),
        },
      });

      const token: string = createJWT(user);
      delete user['password'];
      res.status(HttpStatusCode.OK).json({ data: { token, user } });
    } catch (err) {
      console.error(err);
      return respondWithError(
        res,
        HttpStatusCode.InternalServerError,
        'Internal Server Error'
      );
    }
  };

  const login = async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username && !password) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Username and password are required.'
        );
      }

      if (!username) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Username is required.'
        );
      }

      if (!password) {
        return respondWithError(
          res,
          HttpStatusCode.BadRequest,
          'Password is required.'
        );
      }

      const user: User | null = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return respondWithError(
          res,
          HttpStatusCode.NotFound,
          'User not found.'
        );
      }

      const isValidPassword: boolean = await validateUserPassword(
        password,
        user['password']
      );

      if (!isValidPassword) {
        return respondWithError(
          res,
          HttpStatusCode.Unauthorized,
          'Invalid password.'
        );
      }

      const token: string = createJWT(user);
      delete user['password'];
      res.status(HttpStatusCode.OK).json({ data: { token, user } });
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
    register,
    login,
  };
}
