import { Router } from 'express';

import { ApiRoutes } from '@jhh/shared/enums';

import { JhhServerControllerDashboard } from '@jhh/jhh-server/controller/dashboard';
import { JhhServerControllerNotes } from '@jhh/jhh-server/controller/notes';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();

  const dashboardController = JhhServerControllerDashboard();
  const notesController = JhhServerControllerNotes();

  router.get(ApiRoutes.Test, (req, res) => {
    res.send('Hello World!');
  });

  router.get(ApiRoutes.LoadAssignedData, dashboardController.loadAssignedData);

  router.post(ApiRoutes.NotesGroups, notesController.addNotesGroup);
  // router.put(ApiRoutes., notesController.);
  // router.delete(ApiRoutes., notesController.);

  return router;
}
