import validateFields from './index';
import { RegisterFieldsLength } from '@jhh/shared/enums';

describe('validateFields', () => {
  it('should return error if username or password is missing', () => {
    expect(validateFields('', 'password')).toBe(
      'Username and password are required'
    );
    expect(validateFields('username', '')).toBe(
      'Username and password are required'
    );
    expect(validateFields('', '')).toBe('Username and password are required');
  });

  it('should return error if username is too short or too long', () => {
    const tooShortUsername = 'a'.repeat(
      Number(RegisterFieldsLength.MinUsernameLength) - 1
    );
    const tooLongUsername = 'a'.repeat(
      Number(RegisterFieldsLength.MaxUsernameLength) + 1
    );

    expect(validateFields(tooShortUsername, 'password')).toBe(
      `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`
    );

    expect(validateFields(tooLongUsername, 'password')).toBe(
      `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`
    );
  });

  it('should return error if password is too short or too long', () => {
    const tooShortPassword = 'a'.repeat(
      Number(RegisterFieldsLength.MinPasswordLength) - 1
    );
    const tooLongPassword = 'a'.repeat(
      Number(RegisterFieldsLength.MaxPasswordLength) + 1
    );

    expect(validateFields('username', tooShortPassword)).toBe(
      `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`
    );

    expect(validateFields('username', tooLongPassword)).toBe(
      `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`
    );
  });

  it('should return null if username and password are valid', () => {
    const validUsername = 'a'.repeat(
      Number(RegisterFieldsLength.MinUsernameLength)
    );
    const validPassword = 'a'.repeat(
      Number(RegisterFieldsLength.MinPasswordLength)
    );

    expect(validateFields(validUsername, validPassword)).toBeNull();
  });
});
