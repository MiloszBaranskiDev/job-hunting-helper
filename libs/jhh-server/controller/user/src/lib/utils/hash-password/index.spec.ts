import bcrypt from 'bcrypt';
import hashPassword from './index';

jest.mock('bcrypt');

describe('hashPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password correctly', async () => {
    // Arrange
    const password = 'myPassword';
    const hashedPassword = 'hashedPassword';

    const bcryptHashMock = jest.spyOn(bcrypt, 'hash');
    bcryptHashMock.mockResolvedValue(hashedPassword);

    const result = await hashPassword(password);

    expect(bcryptHashMock).toHaveBeenCalledTimes(1);
    expect(bcryptHashMock).toHaveBeenCalledWith(password, 5);
    expect(result).toBe(hashedPassword);
  });
});
