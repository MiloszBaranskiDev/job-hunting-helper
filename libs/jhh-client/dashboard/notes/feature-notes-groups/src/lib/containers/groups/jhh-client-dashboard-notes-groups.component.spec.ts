import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

import {
  NotesFacade,
  QueryParamsService,
} from '@jhh/jhh-client/dashboard/notes/data-access';

import { JhhClientDashboardNotesGroupsComponent } from './jhh-client-dashboard-notes-groups.component';

describe('JhhClientDashboardNotesGroupsComponent', () => {
  let component: JhhClientDashboardNotesGroupsComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupsComponent>;
  let mockNotesFacade: any, mockQueryParamsService: any, mockCdr;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      notesGroups$: of([
        { name: 'name1', slug: 'name1-slug' },
        { name: 'name2', slug: 'name2-slug' },
      ]),
      searchNotesGroups$ByName: jest.fn(),
      addNotesGroupSuccess$: of(true),
    };
    mockQueryParamsService = {
      setFromCurrentRoute: jest.fn(),
      updateQueryParams: jest.fn(),
      clearQueryParams: jest.fn(),
      getCurrentSort$: jest.fn(),
      getCurrentPage$: jest.fn(),
    };
    mockCdr = { detectChanges: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupsComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: mockCdr },
        { provide: NotesFacade, useValue: mockNotesFacade },
        { provide: QueryParamsService, useValue: mockQueryParamsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should initialize data and call necessary methods', () => {
    expect(mockQueryParamsService.setFromCurrentRoute).toHaveBeenCalled();
    expect(mockQueryParamsService.updateQueryParams).toHaveBeenCalled();
  });

  it('ngOnDestroy should call clearQueryParams', () => {
    component.ngOnDestroy();
    expect(mockQueryParamsService.clearQueryParams).toHaveBeenCalled();
  });

  it('should sort groups correctly', () => {
    mockQueryParamsService.getCurrentSort$.mockReturnValue(
      of('someSortCriteria')
    );
    fixture.detectChanges();

    expect(mockQueryParamsService.getCurrentSort$).toHaveBeenCalled();
  });

  it('should handle pagination correctly', () => {
    mockQueryParamsService.getCurrentPage$.mockReturnValue(of(2));
    fixture.detectChanges();

    expect(mockQueryParamsService.getCurrentPage$).toHaveBeenCalled();
  });

  it('should subscribe to notesGroups$ and set data', () => {
    fixture.detectChanges();
    component.notesGroups$.subscribe((groups) => {
      expect(groups?.length).toBeGreaterThan(0);
    });
  });

  it('should search groups correctly', () => {
    const searchQuery: string = 'test';
    mockNotesFacade.searchNotesGroups$ByName.mockReturnValue(of([]));

    component.searchGroups(searchQuery).subscribe((results) => {
      expect(results).toBeInstanceOf(Array);
      expect(mockNotesFacade.searchNotesGroups$ByName).toHaveBeenCalledWith(
        searchQuery
      );
    });
  });
});
