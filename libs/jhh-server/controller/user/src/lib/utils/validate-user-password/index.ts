import bcrypt from 'bcrypt';

const validateUserPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export default validateUserPassword;
