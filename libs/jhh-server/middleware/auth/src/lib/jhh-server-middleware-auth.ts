import jwt from 'jsonwebtoken';
import { User } from '@jhh/shared/interfaces';

export function JhhServerMiddlewareAuth(req, res, next): void {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'Not authorized' });
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({ message: 'Not valid token' });
    return;
  }

  try {
    const user: User = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: 'Not valid token' });
    return;
  }
}
