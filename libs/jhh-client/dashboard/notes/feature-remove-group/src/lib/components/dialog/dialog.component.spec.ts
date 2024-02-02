import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RemoveNotesGroupDialogService } from '../../service/remove-notes-group-dialog.service';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { DialogComponent } from './dialog.component';

import { NotesGroup } from '@jhh/shared/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: any, mockRemoveNotesGroupDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      removeNotesGroupInProgress$: of(false),
      removeNotesGroupError$: of(null),
      removeNotesGroup: jest.fn(),
    };
    mockRemoveNotesGroupDialogService = {
      clearNotesGroupToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, DialogComponent],
      providers: [
        { provide: NotesFacade, useValue: mockNotesFacade },
        {
          provide: RemoveNotesGroupDialogService,
          useValue: mockRemoveNotesGroupDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.groupToRemove = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle remove correctly', () => {
    const groupId: string = '1';
    component.handleRemove(groupId);
    expect(mockNotesFacade.removeNotesGroup).toHaveBeenCalledWith(groupId);
  });
});
