import { PrismaClient } from '@prisma/client';
import { JhhServerDb } from '@jhh/jhh-server/db';
import { User } from '@jhh/shared/interfaces';
import createJWT from './utils/create-jwt';
import hashPassword from './utils/hash-password';
import validateFields from './utils/validate-fields';
import comparePasswords from './utils/compare-passwords';

export function JhhServerControllerUser() {
  const prisma: PrismaClient = JhhServerDb();

  const createNewUser = async (req, res): Promise<void> => {
    try {
      let { username, password, confirmPassword } = req.body;

      username = username.trim();
      password = password.trim();
      confirmPassword = confirmPassword.trim();

      const validationError: string | null = validateFields(
        username,
        password,
        confirmPassword,
        {
          usernameRequired: true,
          passwordRequired: true,
          confirmPasswordRequired: true,
        }
      );
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const existingUser: User = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      const user: User = await prisma.user.create({
        data: {
          username: username,
          password: await hashPassword(password),
        },
      });

      const token = createJWT(user);
      res.json({ token });
    } catch (err) {
      console.error(err);

      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const signIn = async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username && !password) {
        res.status(400).json({ error: 'Username and password are required.' });
        return;
      }

      if (!username) {
        res.status(400).json({ error: 'Username is required.' });
        return;
      }

      if (!password) {
        res.status(400).json({ error: 'Password is required.' });
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

      const isValid = await comparePasswords(password, user.password);

      if (!isValid) {
        res.status(401).json({ message: 'Invalid password.' });
        return;
      }

      const token = createJWT(user);
      res.status(200).json({ data: { token } });
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getUser = async (req, res): Promise<void> => {
    try {
      let { username } = req.body;

      username = username.trim();

      const validationError: string | null = validateFields(
        username,
        null,
        null,
        { usernameRequired: true }
      );
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

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
