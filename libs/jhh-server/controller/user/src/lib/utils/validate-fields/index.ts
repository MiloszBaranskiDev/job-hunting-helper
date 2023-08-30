import { RegisterFieldsLength } from '@jhh/shared/enums';

type ValidateOptions = {
  usernameRequired?: boolean;
  passwordRequired?: boolean;
  confirmPasswordRequired?: boolean;
};

const validateFields = (
  username?: string,
  password?: string,
  confirmPassword?: string,
  options?: ValidateOptions
): string | null => {
  const {
    usernameRequired = false,
    passwordRequired = false,
    confirmPasswordRequired = false,
  } = options || {};

  if (usernameRequired && !username) {
    return 'Username is required';
  }

  if (passwordRequired && !password) {
    return 'Password is required';
  }

  if (confirmPasswordRequired && !confirmPassword) {
    return 'Confirm Password is required';
  }

  if (
    username &&
    (username.length < Number(RegisterFieldsLength.MinUsernameLength) ||
      username.length > Number(RegisterFieldsLength.MaxUsernameLength))
  ) {
    return `Username must be between ${RegisterFieldsLength.MinUsernameLength} and ${RegisterFieldsLength.MaxUsernameLength} characters`;
  }

  if (
    password &&
    (password.length < Number(RegisterFieldsLength.MinPasswordLength) ||
      password.length > Number(RegisterFieldsLength.MaxPasswordLength))
  ) {
    return `Password must be between ${RegisterFieldsLength.MinPasswordLength} and ${RegisterFieldsLength.MaxPasswordLength} characters`;
  }

  if (confirmPassword !== password) {
    return `Passwords are different`;
  }

  return null;
};

export default validateFields;
