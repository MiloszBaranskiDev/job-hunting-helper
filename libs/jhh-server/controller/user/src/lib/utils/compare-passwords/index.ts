import bcrypt from 'bcrypt';

const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export default comparePasswords;
