import { Router } from 'express';
import { ApiRoutes } from '@jhh/shared/enums';
import { JhhServerControllerUser } from '@jhh/jhh-server/controller/user';
import { JhhServerMiddlewareAuth } from '@jhh/jhh-server/middleware/auth';

export function JhhServerRouterUser(): Router {
  const router: Router = Router();
  const controller = JhhServerControllerUser();

  router.post(ApiRoutes.CreateNewUser, controller.createNewUser);
  router.post(ApiRoutes.SignIn, controller.signIn);
  router.get(ApiRoutes.GetUser, JhhServerMiddlewareAuth, controller.getUser);

  return router;
}
