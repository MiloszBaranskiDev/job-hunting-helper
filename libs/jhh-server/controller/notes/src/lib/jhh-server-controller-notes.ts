import addNote from './add-note/index';
import addNotesGroup from './add-notes-group/index';
import editNotesGroup from './edit-notes-group/index';
import removeNotesGroup from './remove-notes-group/index';
import editNote from './edit-note/index';
import duplicateNote from './duplicate-note/index';
import changeNoteGroup from './change-note-group/index';
import removeNote from './remove-note/index';

export function JhhServerControllerNotes() {
  return {
    addNotesGroup,
    editNotesGroup,
    removeNotesGroup,
    addNote,
    editNote,
    duplicateNote,
    changeNoteGroup,
    removeNote,
  };
}
