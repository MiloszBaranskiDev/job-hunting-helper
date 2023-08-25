import { Router } from 'express';
import { ApiRoutes } from '@jhh/shared/enums';

export function JhhServerRouter(): Router {
  const router: Router = Router();

  router.get(ApiRoutes.test, (req, res) => {
    res.send('Hello World!');
  });

  return router;
}
