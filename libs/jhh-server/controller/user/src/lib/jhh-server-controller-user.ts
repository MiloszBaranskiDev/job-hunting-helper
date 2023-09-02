import { PrismaClient } from '@prisma/client';
import { JhhServerDb } from '@jhh/jhh-server/db';
import { User } from '@jhh/shared/interfaces';
import createJWT from './utils/create-jwt';
import hashPassword from './utils/hash-password';
import validateUserPassword from './utils/validate-user-password/index';
import { RegisterFieldsLength } from '@jhh/shared/enums';

export function JhhServerControllerUser() {
  const prisma: PrismaClient = JhhServerDb();

  const createNewUser = async (req, res): Promise<void> => {
    try {
      const { username, password, confirmPassword } = req.body;

      if (!username || !password || !confirmPassword) {
        res.status(400).json({ message: 'All fields are required.' });
        return;
      }

      if (/\s/.test(username)) {
        res
          .status(400)
          .json({ message: 'Username should not contain whitespace' });
        return;
      }

      if (/\s/.test(password)) {
        res
          .status(400)
          .json({ message: 'Password should not contain whitespace' });
        return;
      }

      if (
        username.length < RegisterFieldsLength.MinUsernameLength ||
        username.length > RegisterFieldsLength.MaxUsernameLength
      ) {
        res.status(400).json({
          message: `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`,
        });
        return;
      }

      if (
        password.length < RegisterFieldsLength.MinPasswordLength ||
        password.length > RegisterFieldsLength.MaxPasswordLength
      ) {
        res.status(400).json({
          message: `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`,
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
        return;
      }

      const existingUser: User = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (existingUser) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      const user: User = await prisma.user.create({
        data: {
          username: username,
          password: await hashPassword(password),
        },
      });

      const token = createJWT(user);
      res.status(200).json({ data: { token } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const signIn = async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username && !password) {
        res
          .status(400)
          .json({ message: 'Username and password are required.' });
        return;
      }

      if (!username) {
        res.status(400).json({ message: 'Username is required.' });
        return;
      }

      if (!password) {
        res.status(400).json({ message: 'Password is required.' });
        return;
      }

      const user: User | null = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      const isValidPassword = await validateUserPassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid password.' });
        return;
      }

      const token = createJWT(user);
      res.status(200).json({ data: { token } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getUser = async (req, res): Promise<void> => {
    try {
      const { username } = req.body;

      type UserType = Omit<User, 'password'>;
      const user: UserType | null = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
          createdAt: true,
          username: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error during fetching user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    createNewUser,
    signIn,
    getUser,
  };
}
