import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { QueryParamsService } from './query-params.service';

describe('QueryParamsService', () => {
  let service: QueryParamsService;
  let mockRouter: Partial<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockLocation: Partial<Location>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    mockRouter = { url: '/test?page=2&sort=Oldest' };
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: convertToParamMap({
          page: '2',
          sort: 'Oldest',
        }),
      } as any,
    };
    mockLocation = { replaceState: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        QueryParamsService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
      ],
    });
    service = TestBed.inject(QueryParamsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return the current page and sort from BehaviorSubjects', () => {
    expect(service.getCurrentPage$().getValue()).toBe(1);
    expect(service.getCurrentSort$().getValue()).toBe('Latest');
  });

  it('should update current page', () => {
    service.updateCurrentPage(3);
    expect(service.getCurrentPage$().getValue()).toBe(3);
    expect(mockLocation.replaceState).toHaveBeenCalledWith(
      '/test?page=3&sort=Latest'
    );
  });

  it('should update current sort', () => {
    service.updateCurrentSort('Oldest');
    expect(service.getCurrentSort$().getValue()).toBe('Oldest');
    expect(service.getCurrentPage$().getValue()).toBe(1);
    expect(mockLocation.replaceState).toHaveBeenCalledWith(
      '/test?page=1&sort=Oldest'
    );
  });

  it('should clear query params', () => {
    service.clearQueryParams();
    expect(service.getCurrentPage$().getValue()).toBe(1);
    expect(service.getCurrentSort$().getValue()).toBe('Latest');
  });

  it('should set from current route', () => {
    service.setFromCurrentRoute();
    expect(service.getCurrentPage$().getValue()).toBe(2);
    expect(service.getCurrentSort$().getValue()).toBe('Oldest');
  });
});
