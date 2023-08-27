import jwt from 'jsonwebtoken';
import createJWT from './index';
import { User } from '@jhh/shared/interfaces';

jest.mock('jsonwebtoken');

const user = {
  id: '1234',
  username: 'testUser',
} as User;

describe('createJWT', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a JWT token with correct payload', () => {
    process.env.JWT_SECRET = 'testSecret';

    const jwtSignMock = jest.spyOn(jwt, 'sign');
    jwtSignMock.mockReturnValue('mockedToken');

    const token = createJWT(user);

    expect(jwtSignMock).toHaveBeenCalledTimes(1);
    expect(jwtSignMock).toHaveBeenCalledWith(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    expect(token).toBe('mockedToken');
  });

  it('should throw an error if JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;

    expect(() => {
      createJWT(user);
    }).toThrow();
  });
});
