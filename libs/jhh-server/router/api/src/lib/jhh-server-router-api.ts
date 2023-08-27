import { Router } from 'express';
import { ApiRoutes } from '@jhh/shared/enums';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();

  router.get(ApiRoutes.Test, (req, res) => {
    res.send('Hello World!');
  });

  return router;
}
