import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { GroupsListComponent } from './groups-list.component';

import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';

import { NotesGroup } from '@jhh/shared/domain';

describe('GroupsListComponent', () => {
  let component: GroupsListComponent;
  let fixture: ComponentFixture<GroupsListComponent>;
  let mockBreakpointService,
    mockEditNotesGroupDialogService: any,
    mockRemoveNotesGroupDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockBreakpointService = {
      breakpoint$: of('some-breakpoint-value'),
    };
    mockEditNotesGroupDialogService = { openDialog: jest.fn() };
    mockRemoveNotesGroupDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [GroupsListComponent],
      providers: [
        { provide: BreakpointService, useValue: mockBreakpointService },
        {
          provide: EditNotesGroupDialogService,
          useValue: mockEditNotesGroupDialogService,
        },
        {
          provide: RemoveNotesGroupDialogService,
          useValue: mockRemoveNotesGroupDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breakpoint observable', () => {
    expect(component.breakpoint$).toBeInstanceOf(Observable);
  });

  it('should call edit dialog service on openEditNotesGroupDialog', () => {
    const mockGroup: NotesGroup = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;
    component.openEditNotesGroupDialog(mockGroup);
    expect(mockEditNotesGroupDialogService.openDialog).toHaveBeenCalledWith(
      mockGroup
    );
  });

  it('should call remove dialog service on openRemoveNotesGroupDialog', () => {
    const mockGroup: NotesGroup = {
      id: '1',
      name: 'Test Group',
      notes: [],
    } as unknown as NotesGroup;
    component.openRemoveNotesGroupDialog(mockGroup);
    expect(mockRemoveNotesGroupDialogService.openDialog).toHaveBeenCalledWith(
      mockGroup
    );
  });

  it('trackByFn should return correct item id', () => {
    const index: number = 0;
    const item: NotesGroup = {
      id: '123',
      name: 'Test',
      notes: [],
    } as unknown as NotesGroup;
    expect(component.trackByFn(index, item)).toBe('123');
  });
});
