import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AddGroupComponent } from './add-group.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { AddNotesGroupFormField } from '../../enums/add-notes-group-form-field';

describe('AddGroupComponent', () => {
  let component: AddGroupComponent;
  let fixture: ComponentFixture<AddGroupComponent>;
  let mockDialog: any, mockNotesFacade: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(null)),
    };
    mockNotesFacade = {
      addNotesGroupInProgress$: of(false),
      addNotesGroupError$: of(null),
      addNotesGroupSuccess$: of(false),
      addNotesGroup: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, AddGroupComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group with name control', () => {
    expect(component.formGroup.get(AddNotesGroupFormField.Name)).toBeTruthy();
    expect(
      component.formGroup.get(AddNotesGroupFormField.Name)?.validator
    ).toBeTruthy();
  });
});
