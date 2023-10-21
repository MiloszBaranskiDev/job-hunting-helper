import { Router } from 'express';

import { ApiRoute } from '@jhh/shared/enums';

import { JhhServerControllerDashboard } from '@jhh/jhh-server/controller/dashboard';
import { JhhServerControllerNotes } from '@jhh/jhh-server/controller/notes';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();

  const dashboardController = JhhServerControllerDashboard();
  const notesController = JhhServerControllerNotes();

  router.get(ApiRoute.Test, (req, res) => {
    res.send('Hello World!');
  });

  router.get(ApiRoute.LoadAssignedData, dashboardController.loadAssignedData);

  router.post(ApiRoute.AddNotesGroup, notesController.addNotesGroup);

  router.post(ApiRoute.AddNote, notesController.addNote);
  router.post(ApiRoute.DuplicateNote, notesController.duplicateNote);
  router.put(ApiRoute.EditNote, notesController.editNote);
  router.delete(ApiRoute.RemoveNote, notesController.removeNote);

  return router;
}
