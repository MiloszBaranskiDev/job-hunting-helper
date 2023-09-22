import { Action } from '@ngrx/store';

import * as DashboardActions from './dashboard.actions';
import { DashboardEntity } from './dashboard.models';
import {
  DashboardState,
  initialDashboardState,
  dashboardReducer,
} from './dashboard.reducer';

describe('Dashboard Reducer', () => {
  const createDashboardEntity = (id: string, name = ''): DashboardEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Dashboard actions', () => {
    it('loadDashboardSuccess should return the list of known Dashboard', () => {
      const dashboard = [
        createDashboardEntity('PRODUCT-AAA'),
        createDashboardEntity('PRODUCT-zzz'),
      ];
      const action = DashboardActions.loadDashboardSuccess({ dashboard });

      const result: DashboardState = dashboardReducer(
        initialDashboardState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = dashboardReducer(initialDashboardState, action);

      expect(result).toBe(initialDashboardState);
    });
  });
});
