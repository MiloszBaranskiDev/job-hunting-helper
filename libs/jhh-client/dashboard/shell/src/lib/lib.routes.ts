import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { JhhClientDashboardShellComponent } from './containers/shell/jhh-client-dashboard-shell.component';

import { AuthPublicFacade, authPublicGuard } from '@jhh/jhh-client/auth/public';
import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

import {
  DASHBOARD_STATE_KEY,
  DashboardEffects,
  DashboardFacade,
  dashboardReducer,
} from '@jhh/jhh-client/dashboard/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardNotesShellRoutes } from '@jhh/jhh-client/dashboard/notes/shell';

export const JhhClientDashboardShellRoutes: Route = {
  path: ClientRoute.Home,
  component: JhhClientDashboardShellComponent,
  providers: [
    provideState(DASHBOARD_STATE_KEY, dashboardReducer),
    provideEffects(DashboardEffects),
    AuthFeatureFacade,
    AuthPublicFacade,
    DashboardFacade,
  ],
  canActivate: [authPublicGuard],
  children: [JhhClientDashboardNotesShellRoutes],
};
