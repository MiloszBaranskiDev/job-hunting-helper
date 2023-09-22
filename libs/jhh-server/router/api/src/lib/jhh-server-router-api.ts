import { Router } from 'express';

import { ApiRoutes } from '@jhh/shared/enums';

import { JhhServerControllerDashboard } from '@jhh/jhh-server/controller/dashboard';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();
  const dashboardController = JhhServerControllerDashboard();

  router.get(ApiRoutes.Test, (req, res) => {
    res.send('Hello World!');
  });

  router.get(ApiRoutes.LoadAssignedData, dashboardController.loadAssignedData);

  return router;
}
