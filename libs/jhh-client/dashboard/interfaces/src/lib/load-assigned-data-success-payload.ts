import {
  BoardColumn,
  NotesGroup,
  Offer,
  ScheduleEvent,
} from '@jhh/shared/interfaces';

export interface LoadAssignedDataSuccessPayload {
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
  offers: Offer[];
  scheduleEvents: ScheduleEvent[];
  unsavedBoardRequestId?: string;
}
