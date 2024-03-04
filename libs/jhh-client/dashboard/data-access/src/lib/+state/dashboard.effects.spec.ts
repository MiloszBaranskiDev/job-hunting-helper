import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { DashboardEffects } from './dashboard.effects';
import { DashboardService } from '../services/dashboard.service';
import { DashboardFacade } from './dashboard.facade';
import * as DashboardActions from './dashboard.actions';

describe('DashboardEffects', () => {
  let actions$: Observable<any>;
  let effects: DashboardEffects;
  let dashboardService: jest.Mocked<DashboardService>;
  let dashboardFacade: jest.Mocked<DashboardFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions$),
        {
          provide: DashboardService,
          useValue: { loadAssignedData: jest.fn() },
        },
        { provide: DashboardFacade, useValue: { setData: jest.fn() } },
      ],
    });

    effects = TestBed.inject(DashboardEffects);
    dashboardService = TestBed.inject(
      DashboardService
    ) as jest.Mocked<DashboardService>;
    dashboardFacade = TestBed.inject(
      DashboardFacade
    ) as jest.Mocked<DashboardFacade>;
    global.localStorage = jest.fn(() => ({
      getItem: jest.fn(),
      removeItem: jest.fn(),
      setItem: jest.fn(),
    })) as any;
  });

  it('should handle loadAssignedData and dispatch loadAssignedDataSuccess', (done) => {
    const mockData = {};
    dashboardService.loadAssignedData.mockReturnValue(of(mockData as any));
    actions$ = of(DashboardActions.loadAssignedData());

    effects.loadAssignedData$.subscribe((action) => {
      expect(action).toEqual(
        DashboardActions.loadAssignedDataSuccess({ payload: mockData as any })
      );
      done();
    });
  });

  it('should handle service error and dispatch the correct actions', async () => {
    const errorResponse = new Error('Service error');
    dashboardService.loadAssignedData.mockReturnValue(
      throwError(() => errorResponse)
    );

    actions$ = of(DashboardActions.loadAssignedData());

    const emittedActions: any[] = [];
    effects.loadAssignedData$.subscribe({
      next: (action) => emittedActions.push(action),
      complete: () => {
        expect(emittedActions).toContainEqual(
          DashboardActions.loadAssignedDataFail({
            payload: errorResponse as any,
          })
        );
      },
    });
  });
});
