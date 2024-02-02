import jwt from 'jsonwebtoken';

import { User } from '@jhh/shared/domain';

const createJWT = (user: User) => {
  const token: string = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );

  return token;
};

export default createJWT;
