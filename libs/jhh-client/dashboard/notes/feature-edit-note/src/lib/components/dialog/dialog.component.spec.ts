import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { FormField } from '../../enums/form-field';

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
      editNoteInProgress$: of(false),
      editNoteError$: of(null),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.noteToEdit = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'note',
      slug: 'note-slug',
      content: 'content',
      groupId: '2',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with noteToEdit values', () => {
    fixture.detectChanges();

    const nameControl = component.formGroup.get(FormField.Name);
    const slugControl = component.formGroup.get(FormField.Slug);
    const contentControl = component.formGroup.get(FormField.Content);

    expect(nameControl!.value).toBe('note');
    expect(slugControl!.value).toBe('note-slug');
    expect(contentControl!.value).toBe('content');
  });
});
