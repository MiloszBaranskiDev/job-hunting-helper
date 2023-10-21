import { Router } from 'express';

import { ApiRoute } from '@jhh/shared/enums';

import { JhhServerControllerUser } from '@jhh/jhh-server/controller/user';

export function JhhServerRouterUser(): Router {
  const router: Router = Router();
  const controller = JhhServerControllerUser();

  router.post(ApiRoute.Login, controller.login);
  router.post(ApiRoute.Register, controller.register);

  return router;
}
