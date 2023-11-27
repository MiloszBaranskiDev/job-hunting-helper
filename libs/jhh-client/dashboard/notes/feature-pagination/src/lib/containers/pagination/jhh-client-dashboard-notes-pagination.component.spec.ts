import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardNotesPaginationComponent } from './jhh-client-dashboard-notes-pagination.component';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/notes/data-access';

describe('JhhClientDashboardNotesPaginationComponent', () => {
  let component: JhhClientDashboardNotesPaginationComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesPaginationComponent>;
  let mockQueryParamsService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockQueryParamsService = {
      getCurrentPage$: jest.fn().mockReturnValue(new BehaviorSubject(1)),
      updateCurrentPage: jest.fn(),
      defaultPage: 1,
    };

    await TestBed.configureTestingModule({
      imports: [
        JhhClientDashboardNotesPaginationComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: QueryParamsService, useValue: mockQueryParamsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesPaginationComponent
    );
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle page change correctly for a valid page number', () => {
    const validPage: number = 2;
    component.totalPages = 5;
    component.handlePageChange(validPage);
    expect(mockQueryParamsService.updateCurrentPage).toHaveBeenCalledWith(
      validPage
    );
  });

  it('should not update page for an invalid page number', () => {
    const invalidPage: number = 6;
    component.totalPages = 5;
    component.handlePageChange(invalidPage);
    expect(mockQueryParamsService.updateCurrentPage).not.toHaveBeenCalledWith(
      invalidPage
    );
  });
});
