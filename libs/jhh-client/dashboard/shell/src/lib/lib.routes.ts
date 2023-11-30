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
import {
  NOTES_STATE_KEY,
  NotesFacade,
  notesReducer,
} from '@jhh/jhh-client/dashboard/notes/data-access';
import {
  BOARD_STATE_KEY,
  boardReducer,
} from '@jhh/jhh-client/dashboard/board/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardNotesShellRoutes } from '@jhh/jhh-client/dashboard/notes/shell';
import { JhhClientDashboardBoardShellRoutes } from '@jhh/jhh-client/dashboard/board/shell';

export const JhhClientDashboardShellRoutes: Route = {
  path: ClientRoute.Home,
  title: 'Home',
  component: JhhClientDashboardShellComponent,
  providers: [
    provideState(DASHBOARD_STATE_KEY, dashboardReducer),
    provideState(NOTES_STATE_KEY, notesReducer),
    provideState(BOARD_STATE_KEY, boardReducer),
    provideEffects(DashboardEffects),
    AuthFeatureFacade,
    AuthPublicFacade,
    DashboardFacade,
    NotesFacade,
  ],
  canActivate: [authPublicGuard],
  children: [
    JhhClientDashboardNotesShellRoutes,
    JhhClientDashboardBoardShellRoutes,
  ],
};
