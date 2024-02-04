import {
  BoardColumn,
  NotesGroup,
  Offer,
  Quiz,
  ScheduleEvent,
} from '@jhh/shared/domain';

export interface LoadAssignedDataSuccessPayload {
  newToken: string;
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
  offers: Offer[];
  scheduleEvents: ScheduleEvent[];
  practiceQuizzes: Quiz[];
  unsavedBoardRequestId?: string;
}
