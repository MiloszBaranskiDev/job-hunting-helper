import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNoteDialogService } from '../../service/remove-note-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { DialogComponent } from './dialog.component';

import { Note } from '@jhh/shared/interfaces';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: any, mockRemoveNoteDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      removeNoteInProgress$: of(false),
      removeNoteError$: of(null),
      removeNote: jest.fn(),
    };
    mockRemoveNoteDialogService = {
      clearNoteToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogComponent],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.noteToRemove = {
      id: '1',
      name: 'Test Note',
    } as unknown as Note;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle remove correctly', () => {
    const noteId: string = '1';
    component.handleRemove(noteId);
    expect(mockNotesFacade.removeNote).toHaveBeenCalledWith(noteId);
  });
});
