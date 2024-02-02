import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroup } from '@jhh/shared/domain';
import { NotesGroupFormField } from '@jhh/jhh-client/dashboard/notes/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: Partial<NotesFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      editNotesGroupInProgress$: of(false),
      editNotesGroupError$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.groupToEdit = {
      id: 'mockGroupId',
      name: 'mockGroupName',
      slug: 'mockGroupSlug',
    } as NotesGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with groupToEdit values', () => {
    fixture.detectChanges();

    const nameControl = component.formGroup.get(NotesGroupFormField.Name);
    const slugControl = component.formGroup.get(NotesGroupFormField.Slug);

    expect(nameControl!.value).toBe('mockGroupName');
    expect(slugControl!.value).toBe('mockGroupSlug');
  });
});
