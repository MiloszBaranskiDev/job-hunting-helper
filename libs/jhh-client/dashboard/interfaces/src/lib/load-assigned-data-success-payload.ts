import { BoardColumn, NotesGroup } from '@jhh/shared/interfaces';

export interface LoadAssignedDataSuccessPayload {
  notesGroups: NotesGroup[];
  boardColumns: BoardColumn[];
}
