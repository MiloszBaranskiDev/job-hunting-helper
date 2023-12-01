import { Router } from 'express';

import { ApiRoute } from '@jhh/shared/enums';

import { JhhServerControllerDashboard } from '@jhh/jhh-server/controller/dashboard';
import { JhhServerControllerNotes } from '@jhh/jhh-server/controller/notes';
import { JhhServerControllerBoard } from '@jhh/jhh-server/controller/board';

export function JhhServerRouterApi(): Router {
  const router: Router = Router();

  const dashboardController = JhhServerControllerDashboard();
  const notesController = JhhServerControllerNotes();
  const boardController = JhhServerControllerBoard();

  router.get(ApiRoute.Test, (req, res) => {
    res.send('Hello World!');
  });

  router.get(ApiRoute.LoadAssignedData, dashboardController.loadAssignedData);

  router.post(ApiRoute.AddNotesGroup, notesController.addNotesGroup);
  router.put(ApiRoute.EditNotesGroup, notesController.editNotesGroup);
  router.delete(ApiRoute.RemoveNotesGroup, notesController.removeNotesGroup);

  router.post(ApiRoute.AddNote, notesController.addNote);
  router.post(ApiRoute.DuplicateNote, notesController.duplicateNote);
  router.put(ApiRoute.EditNote, notesController.editNote);
  router.patch(ApiRoute.ChangeNoteGroup, notesController.changeNoteGroup);
  router.delete(ApiRoute.RemoveNote, notesController.removeNote);

  router.post(
    ApiRoute.DuplicateBoardColumn,
    boardController.duplicateBoardColumn
  );
  router.delete(ApiRoute.RemoveBoardColumn, boardController.removeBoardColumn);

  return router;
}
