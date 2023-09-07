import { Response } from 'express';

import { HttpStatusCode } from '@jhh/shared/enums';

export function respondWithError(
  res: Response,
  code: HttpStatusCode,
  message: string
): void {
  res.status(code).json({ message: message });
  return;
}
