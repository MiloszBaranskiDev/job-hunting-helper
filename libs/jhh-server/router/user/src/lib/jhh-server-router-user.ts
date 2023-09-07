import { Router } from 'express';

import { ApiRoutes } from '@jhh/shared/enums';

import { JhhServerControllerUser } from '@jhh/jhh-server/controller/user';

export function JhhServerRouterUser(): Router {
  const router: Router = Router();
  const controller = JhhServerControllerUser();

  router.post(ApiRoutes.Login, controller.login);
  router.post(ApiRoutes.Register, controller.register);

  return router;
}
