import {
  BoardColumn,
  NotesGroup,
  Offer,
  Quiz,
  ScheduleEvent,
} from '@jhh/shared/domain';

export interface LoadAssignedDataSuccessPayload {
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
  offers: Offer[];
  scheduleEvents: ScheduleEvent[];
  practiceQuizzes: Quiz[];
  unsavedBoardRequestId?: string;
}
