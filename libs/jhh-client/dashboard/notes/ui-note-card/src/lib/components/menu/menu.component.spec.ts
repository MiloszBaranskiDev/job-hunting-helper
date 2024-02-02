import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { MenuComponent } from './menu.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note, NotesGroup } from '@jhh/shared/domain';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockNotesFacade: Partial<NotesFacade>;
  let mockGroups$: Observable<NotesGroup[] | null>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockGroups$ = of([
      {
        id: '1',
        name: 'name',
        slug: 'slug',
      },
    ] as NotesGroup[]);

    mockNotesFacade = {
      getGroups$: () => mockGroups$,
      duplicateNote: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.note = {
      id: '1',
      name: 'note',
      slug: 'slug',
    } as Note;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
