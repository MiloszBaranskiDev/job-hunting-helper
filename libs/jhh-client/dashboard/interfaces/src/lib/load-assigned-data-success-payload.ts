import { BoardColumn, NotesGroup, Offer } from '@jhh/shared/interfaces';

export interface LoadAssignedDataSuccessPayload {
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
  offers: Offer[];
  unsavedBoardRequestId?: string;
}
