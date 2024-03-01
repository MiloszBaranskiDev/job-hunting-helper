import '@angular/compiler';

import * as NotesSelectors from './notes.selectors';

describe('Notes Selectors Full Suite', () => {
  const mockInitialState = {
    notes: {
      ids: ['1', '2'],
      entities: {
        '1': {
          id: '1',
          name: 'Group 1',
          slug: 'group-1',
          notes: [
            {
              id: 'note1',
              name: 'Note 1',
              slug: 'note-1',
              content: 'Content 1',
              groupId: '1',
            },
          ],
        },
        '2': { id: '2', name: 'Group 2', slug: 'group-2', notes: [] },
      },
      addNotesGroup: { inProgress: false, error: null, success: true },
      editNotesGroup: { inProgress: false, error: 'Error', success: false },
      duplicateNotesGroup: { inProgress: true, error: null },
      removeNotesGroup: { inProgress: false, error: null, success: true },
      addNote: { inProgress: false, error: 'Add note error', success: true },
      editNote: { inProgress: true, error: null, success: false },
      duplicateNote: {
        inProgress: false,
        error: 'Duplicate error',
        success: true,
      },
      changeNoteGroup: { inProgress: true, error: null, success: false },
      removeNote: {
        inProgress: false,
        error: 'Remove note error',
        success: true,
      },
    } as any,
  };

  describe('selectEditNotesGroupInProgress', () => {
    it('should select the editNotesGroup inProgress state', () => {
      const result = NotesSelectors.selectEditNotesGroupInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectEditNotesGroupError', () => {
    it('should select the editNotesGroupError', () => {
      const result = NotesSelectors.selectEditNotesGroupError.projector(
        mockInitialState.notes
      );
      expect(result).toBe('Error');
    });
  });

  describe('selectEditNotesGroupSuccess', () => {
    it('should select the editNotesGroupSuccess', () => {
      const result = NotesSelectors.selectEditNotesGroupSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectDuplicateNotesGroupInProgress', () => {
    it('should select the duplicateNotesGroupInProgress state', () => {
      const result =
        NotesSelectors.selectDuplicateNotesGroupInProgress.projector(
          mockInitialState.notes
        );
      expect(result).toBe(true);
    });
  });

  describe('selectDuplicateNotesGroupError', () => {
    it('should select the duplicateNotesGroupError', () => {
      const result = NotesSelectors.selectDuplicateNotesGroupError.projector(
        mockInitialState.notes
      );
      expect(result).toBeNull();
    });
  });

  describe('selectRemoveNotesGroupInProgress', () => {
    it('should select the removeNotesGroupInProgress state', () => {
      const result = NotesSelectors.selectRemoveNotesGroupInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectRemoveNotesGroupError', () => {
    it('should select the removeNotesGroupError', () => {
      const result = NotesSelectors.selectRemoveNotesGroupError.projector(
        mockInitialState.notes
      );
      expect(result).toBeNull();
    });
  });

  describe('selectRemoveNotesGroupSuccess', () => {
    it('should select the removeNotesGroupSuccess', () => {
      const result = NotesSelectors.selectRemoveNotesGroupSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(true);
    });
  });

  describe('selectAddNoteInProgress', () => {
    it('should select the addNoteInProgress', () => {
      const result = NotesSelectors.selectAddNoteInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectAddNoteError', () => {
    it('should select the addNoteError', () => {
      const result = NotesSelectors.selectAddNoteError.projector(
        mockInitialState.notes
      );
      expect(result).toBe('Add note error');
    });
  });

  describe('selectAddNoteSuccess', () => {
    it('should select the addNoteSuccess', () => {
      const result = NotesSelectors.selectAddNoteSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(true);
    });
  });

  describe('selectEditNoteInProgress', () => {
    it('should select the editNoteInProgress state', () => {
      const result = NotesSelectors.selectEditNoteInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(true);
    });
  });

  describe('selectEditNoteError', () => {
    it('should select the editNoteError', () => {
      const result = NotesSelectors.selectEditNoteError.projector(
        mockInitialState.notes
      );
      expect(result).toBeNull();
    });
  });

  describe('selectEditNoteSuccess', () => {
    it('should select the editNoteSuccess state', () => {
      const result = NotesSelectors.selectEditNoteSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectChangeNoteGroupInProgress', () => {
    it('should select the changeNoteGroupInProgress state', () => {
      const result = NotesSelectors.selectChangeNoteGroupInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(true);
    });
  });

  describe('selectChangeNoteGroupError', () => {
    it('should select the changeNoteGroupError', () => {
      const result = NotesSelectors.selectChangeNoteGroupError.projector(
        mockInitialState.notes
      );
      expect(result).toBeNull();
    });
  });

  describe('selectChangeNoteGroupSuccess', () => {
    it('should select the changeNoteGroupSuccess state', () => {
      const result = NotesSelectors.selectChangeNoteGroupSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectRemoveNoteInProgress', () => {
    it('should select the removeNoteInProgress state', () => {
      const result = NotesSelectors.selectRemoveNoteInProgress.projector(
        mockInitialState.notes
      );
      expect(result).toBe(false);
    });
  });

  describe('selectRemoveNoteError', () => {
    it('should select the removeNoteError', () => {
      const result = NotesSelectors.selectRemoveNoteError.projector(
        mockInitialState.notes
      );
      expect(result).toBe('Remove note error');
    });
  });

  describe('selectRemoveNoteSuccess', () => {
    it('should select the removeNoteSuccess state', () => {
      const result = NotesSelectors.selectRemoveNoteSuccess.projector(
        mockInitialState.notes
      );
      expect(result).toBe(true);
    });
  });
});
