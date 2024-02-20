import { createJWT, respondWithError } from '@jhh/jhh-server/shared/utils';
import hashPassword from './utils/hash-password';
import validateUserPassword from './utils/validate-user-password';

import { HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerControllerUser } from './jhh-server-controller-user';

const prismaMock = {
  user: {
    findUnique: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({
      username: 'testUser',
      password: 'hashedPassword',
    }),
  },
  notesGroup: {
    create: jest.fn(),
  },
};

jest.mock('@jhh/jhh-server/db', () => {
  return {
    JhhServerDb: jest.fn(() => prismaMock),
  };
});

jest.mock('./utils/create-jwt');
jest.mock('./utils/hash-password');
jest.mock('./utils/validate-user-password');
jest.mock('@jhh/jhh-server/shared/utils');

describe('JhhServerControllerUser', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should handle successful registration', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
      };
      req.body = {
        username: 'testUser',
        password: 'testPassword',
        confirmPassword: 'testPassword',
      };
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(user);
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (createJWT as jest.Mock).mockReturnValue('jwtToken');

      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: { token: 'jwtToken', user },
      });
    });

    it('should handle missing fields', async () => {
      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'All fields are required.'
      );
    });

    it('should handle username already exists', async () => {
      req.body = {
        username: 'existingUser',
        password: 'testPassword',
        confirmPassword: 'testPassword',
      };
      prismaMock.user.findUnique.mockResolvedValue({
        username: 'existingUser',
      });

      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'Username already exists'
      );
    });

    it('should handle username with whitespace', async () => {
      req.body = {
        username: 'test User',
        password: 'testPassword',
        confirmPassword: 'testPassword',
      };

      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'Username should not contain whitespace'
      );
    });

    it('should handle password with whitespace', async () => {
      req.body = {
        username: 'testUser',
        password: 'test Password',
        confirmPassword: 'test Password',
      };

      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'Password should not contain whitespace'
      );
    });

    it('should handle passwords not matching', async () => {
      req.body = {
        username: 'testUser',
        password: 'testPassword',
        confirmPassword: 'differentPassword',
      };

      const controller = JhhServerControllerUser();
      await controller.register(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'Passwords do not match'
      );
    });
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
      };
      req.body = {
        username: 'testUser',
        password: 'testPassword',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      (validateUserPassword as jest.Mock).mockResolvedValue(true);
      (createJWT as jest.Mock).mockReturnValue('jwtToken');

      const controller = JhhServerControllerUser();
      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: { token: 'jwtToken', user },
      });
    });

    it('should handle missing username and password', async () => {
      const controller = JhhServerControllerUser();
      await controller.login(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.BadRequest,
        'Username and password are required.'
      );
    });

    it('should handle user not found', async () => {
      req.body = {
        username: 'nonexistentUser',
        password: 'testPassword',
      };
      prismaMock.user.findUnique.mockResolvedValue(null);

      const controller = JhhServerControllerUser();
      await controller.login(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.NotFound,
        'User not found.'
      );
    });

    it('should handle invalid password', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
      };
      req.body = {
        username: 'testUser',
        password: 'wrongPassword',
      };
      prismaMock.user.findUnique.mockResolvedValue(user);
      (validateUserPassword as jest.Mock).mockResolvedValue(false);

      const controller = JhhServerControllerUser();
      await controller.login(req, res);

      expect(respondWithError).toHaveBeenCalledWith(
        res,
        HttpStatusCode.Unauthorized,
        'Invalid password.'
      );
    });
  });
});
