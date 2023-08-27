import bcrypt from 'bcrypt';

const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export default hashPassword;
