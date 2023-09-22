import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as DashboardActions from './dashboard.actions';
import { DashboardEffects } from './dashboard.effects';
import { DashboardFacade } from './dashboard.facade';
import { DashboardEntity } from './dashboard.models';
import {
  DASHBOARD_FEATURE_KEY,
  DashboardState,
  initialDashboardState,
  dashboardReducer,
} from './dashboard.reducer';
import * as DashboardSelectors from './dashboard.selectors';

interface TestSchema {
  dashboard: DashboardState;
}

describe('DashboardFacade', () => {
  let facade: DashboardFacade;
  let store: Store<TestSchema>;
  const createDashboardEntity = (id: string, name = ''): DashboardEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(DASHBOARD_FEATURE_KEY, dashboardReducer),
          EffectsModule.forFeature([DashboardEffects]),
        ],
        providers: [DashboardFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(DashboardFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allDashboard$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allDashboard$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadDashboardSuccess` to manually update list
     */
    it('allDashboard$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allDashboard$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        DashboardActions.loadDashboardSuccess({
          dashboard: [
            createDashboardEntity('AAA'),
            createDashboardEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allDashboard$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
