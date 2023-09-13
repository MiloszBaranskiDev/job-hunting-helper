import jwt from 'jsonwebtoken';

import createJWT from './index';

import { User } from '@jhh/shared/interfaces';

jest.mock('jsonwebtoken');

describe('createJWT', () => {
  const mockUser: User = {
    id: '1',
    username: 'username',
  } as User;

  const mockSecret = 'secret';
  process.env.JWT_SECRET = mockSecret;

  beforeEach(() => {
    (jwt.sign as jest.Mock).mockClear();
  });

  it('should return a JWT token', () => {
    const token = 'mockToken';
    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = createJWT(mockUser);
    expect(result).toBe(token);
  });

  it('should call jwt.sign with correct parameters', () => {
    createJWT(mockUser);

    expect(jwt.sign as jest.Mock).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        username: mockUser.username,
      },
      mockSecret
    );
  });
});
