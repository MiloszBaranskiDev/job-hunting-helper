import { RegisterFieldsLength } from '@jhh/shared/enums';

const validateFields = (username: string, password: string): string | null => {
  if (!username || !password) {
    return 'Username and password are required';
  }

  if (
    username.length < Number(RegisterFieldsLength.MinUsernameLength) ||
    username.length > Number(RegisterFieldsLength.MaxUsernameLength)
  ) {
    return `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`;
  }

  if (
    password.length < Number(RegisterFieldsLength.MinPasswordLength) ||
    password.length > Number(RegisterFieldsLength.MaxPasswordLength)
  ) {
    return `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`;
  }

  return null;
};

export default validateFields;
