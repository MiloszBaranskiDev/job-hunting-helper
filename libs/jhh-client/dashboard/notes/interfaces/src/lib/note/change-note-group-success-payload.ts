import { Note, NotesGroup } from '@jhh/shared/interfaces';

export interface ChangeNoteGroupSuccessPayload {
  movedNote: Note;
  previousGroup: NotesGroup;
  newGroup: NotesGroup;
}
