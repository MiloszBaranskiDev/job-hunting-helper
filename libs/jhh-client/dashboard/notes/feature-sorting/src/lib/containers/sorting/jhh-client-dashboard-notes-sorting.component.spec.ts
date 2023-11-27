import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardNotesSortingComponent } from './jhh-client-dashboard-notes-sorting.component';

import { QueryParamsService } from '@jhh/jhh-client/dashboard/notes/data-access';

describe('JhhClientDashboardNotesSortingComponent', () => {
  let component: JhhClientDashboardNotesSortingComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesSortingComponent>;
  let queryParamsServiceMock: Partial<QueryParamsService>;
  let mockCurrentSort$: BehaviorSubject<string>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockCurrentSort$ = new BehaviorSubject<string>('date');

    queryParamsServiceMock = {
      // @ts-ignore
      getCurrentSort$: jest.fn(() => mockCurrentSort$.asObservable()),
      updateCurrentSort: jest.fn(),
      defaultSort: 'name',
    };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesSortingComponent, NoopAnimationsModule],
      providers: [
        { provide: QueryParamsService, useValue: queryParamsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to currentSort$ from queryParamsService', () => {
    expect(queryParamsServiceMock.getCurrentSort$).toHaveBeenCalled();
  });

  it('should call updateCurrentSort when an invalid sort is received', () => {
    component.sortOptionsValues = ['name', 'date'];
    component.ngOnInit();

    mockCurrentSort$.next('invalidSort');
    fixture.detectChanges();

    expect(queryParamsServiceMock.updateCurrentSort).toHaveBeenCalledWith(
      queryParamsServiceMock.defaultSort
    );
  });

  it('should handle sort change correctly', () => {
    component.sortOptionsValues = ['name', 'date'];

    const validSort: string = 'name';
    component.onSortChange(validSort);
    expect(queryParamsServiceMock.updateCurrentSort).toHaveBeenCalledWith(
      validSort
    );

    const invalidSort: string = 'invalidSort';
    component.onSortChange(invalidSort);
    expect(queryParamsServiceMock.updateCurrentSort).not.toHaveBeenCalledWith(
      invalidSort
    );
  });
});
