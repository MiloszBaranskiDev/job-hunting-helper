import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { NotesEffects } from './notes.effects';
import * as NotesActions from './notes.actions';
import { NotesService } from '../services/notes.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';

describe('NotesEffects', () => {
  let effects: NotesEffects;
  let actions$: Observable<any>;
  let notesService: jest.Mocked<NotesService>;
  let snackbarService: jest.Mocked<SnackbarService>;
  let editNoteDialogService: jest.Mocked<EditNoteDialogService>;
  let removeNoteDialogService: jest.Mocked<RemoveNoteDialogService>;
  let changeNoteGroupDialogService: jest.Mocked<ChangeNoteGroupDialogService>;
  let editNotesGroupDialogService: jest.Mocked<EditNotesGroupDialogService>;
  let removeNotesGroupDialogService: jest.Mocked<RemoveNotesGroupDialogService>;
  let mockSnackbarRef: Partial<MatSnackBarRef<TextOnlySnackBar>>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    const mockNotesService = {
      addNotesGroup: jest.fn(),
      editNotesGroup: jest.fn(),
      duplicateNotesGroup: jest.fn(),
      changeNoteGroup: jest.fn(),
      removeNote: jest.fn(),
    };

    const mockSnackbarService = {
      open: jest.fn(),
      openIndefinite: jest.fn().mockReturnValue(mockSnackbarRef),
    };

    const mockEditNotesGroupDialogService = {
      clearNotesGroupToEdit: jest.fn(),
    };

    const mockChangeNoteGroupDialogService = {
      clearNoteToMove: jest.fn(),
    };

    const mockRemoveNoteDialogService = {
      clearNoteToRemove: jest.fn(),
    };

    const mockEditNoteDialogService = {
      clearNoteToEdit: jest.fn(),
    };

    mockSnackbarRef = {
      dismiss: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotesEffects,
        provideMockActions(() => actions$),
        { provide: NotesService, useValue: mockNotesService },
        {
          provide: SnackbarService,
          useValue: { open: jest.fn(), openIndefinite: jest.fn() },
        },
        {
          provide: EditNotesGroupDialogService,
          useValue: { clearNotesGroupToEdit: jest.fn() },
        },
        {
          provide: ChangeNoteGroupDialogService,
          useValue: mockChangeNoteGroupDialogService,
        },
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
        { provide: EditNoteDialogService, useValue: mockEditNoteDialogService },
      ],
    });

    effects = TestBed.inject(NotesEffects);
    notesService = TestBed.inject(NotesService) as jest.Mocked<NotesService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jest.Mocked<SnackbarService>;
    editNotesGroupDialogService = TestBed.inject(
      EditNotesGroupDialogService
    ) as jest.Mocked<EditNotesGroupDialogService>;
    changeNoteGroupDialogService = TestBed.inject(
      ChangeNoteGroupDialogService
    ) as jest.Mocked<ChangeNoteGroupDialogService>;
    removeNoteDialogService = TestBed.inject(
      RemoveNoteDialogService
    ) as jest.Mocked<RemoveNoteDialogService>;
    editNoteDialogService = TestBed.inject(
      EditNoteDialogService
    ) as jest.Mocked<EditNoteDialogService>;
    actions$ = new Observable();
  });

  it('should dispatch addNotesGroupSuccess and resetAddNotesGroupSuccess actions and open a snackbar on success', (done) => {
    const addNotesGroupPayload = { name: 'New Group' };
    const addNotesGroupSuccessPayload = { id: '123', name: 'New Group' };
    notesService.addNotesGroup.mockReturnValue(
      of(addNotesGroupSuccessPayload) as any
    );

    actions$ = of(
      NotesActions.addNotesGroup({ payload: addNotesGroupPayload })
    );

    effects.addNotesGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.addNotesGroupSuccess({
          payload: addNotesGroupSuccessPayload as any,
        })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group added successfully!'
      );
      done();
    });
  });

  it('should dispatch editNotesGroupSuccess and resetEditNotesGroupSuccess actions, clear dialog, and open a snackbar on success', (done) => {
    const editNotesGroupPayload = { id: '123', name: 'Updated Group' };
    const editNotesGroupSuccessPayload = { id: '123', name: 'Updated Group' };
    notesService.editNotesGroup.mockReturnValue(
      of(editNotesGroupSuccessPayload as any)
    );

    actions$ = of(
      NotesActions.editNotesGroup({ payload: editNotesGroupPayload as any })
    );

    effects.editNotesGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.editNotesGroupSuccess({
          payload: editNotesGroupSuccessPayload as any,
        })
      );
      expect(
        editNotesGroupDialogService.clearNotesGroupToEdit
      ).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group edited successfully!'
      );
      done();
    });
  });

  it('should show an indefinite snackbar, dispatch duplicateNotesGroupSuccess and resetDuplicateNotesGroupSuccess actions, and then show a success snackbar on completion', (done) => {
    const duplicateNotesGroupPayload = { id: '123' };
    const duplicateNotesGroupSuccessPayload = {
      id: '456',
      name: 'Duplicated Group',
    };
    notesService.duplicateNotesGroup.mockReturnValue(
      of(duplicateNotesGroupSuccessPayload as any)
    );
    snackbarService.openIndefinite.mockReturnValue(
      mockSnackbarRef as MatSnackBarRef<TextOnlySnackBar>
    );

    actions$ = of(
      NotesActions.duplicateNotesGroup({
        payload: duplicateNotesGroupPayload as any,
      })
    );

    effects.duplicateNotesGroup$.subscribe((action) => {
      expect(snackbarService.openIndefinite).toHaveBeenCalledWith(
        'Duplicating group...'
      );
      expect(action).toEqual(
        NotesActions.duplicateNotesGroupSuccess({
          payload: duplicateNotesGroupSuccessPayload as any,
        })
      );
      expect(mockSnackbarRef.dismiss).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group duplicated successfully!'
      );
      done();
    });
  });

  it('should dispatch changeNoteGroupSuccess and resetChangeNoteGroupSuccess actions, clear dialog, and open a snackbar on success', (done) => {
    const changeNoteGroupPayload = {
      noteId: 'note123',
      newGroupId: 'group456',
    };
    const changeNoteGroupSuccessPayload = {
      noteId: 'note123',
      groupId: 'group456',
    };
    notesService.changeNoteGroup.mockReturnValue(
      of(changeNoteGroupSuccessPayload as any)
    );

    actions$ = of(
      NotesActions.changeNoteGroup({ payload: changeNoteGroupPayload })
    );

    effects.changeNoteGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.changeNoteGroupSuccess({
          payload: changeNoteGroupSuccessPayload as any,
        })
      );
      expect(changeNoteGroupDialogService.clearNoteToMove).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Note successfully moved to another group!'
      );
      done();
    });
  });

  it('should dispatch removeNoteSuccess and resetRemoveNoteSuccess actions and open a snackbar on success', (done) => {
    const removeNotePayload = { id: 'note123' };
    const removeNoteSuccessPayload = { id: 'note123' };
    notesService.removeNote.mockReturnValue(
      of(removeNoteSuccessPayload as any)
    );

    actions$ = of(
      NotesActions.removeNote({ payload: removeNotePayload as any })
    );

    effects.removeNote$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.removeNoteSuccess({
          payload: removeNoteSuccessPayload as any,
        })
      );
      expect(removeNoteDialogService.clearNoteToRemove).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Note removed successfully!'
      );
      done();
    });
  });

  it('should handle changeNoteGroup success', (done) => {
    const payload = { noteId: 'note1', newGroupId: 'group1' };
    const successPayload = { noteId: 'note1', groupId: 'group1' };
    notesService.changeNoteGroup.mockReturnValue(of(successPayload as any));
    actions$ = of(NotesActions.changeNoteGroup({ payload }));

    effects.changeNoteGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.changeNoteGroupSuccess({ payload: successPayload as any })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Note successfully moved to another group!'
      );
      done();
    });
  });
});
