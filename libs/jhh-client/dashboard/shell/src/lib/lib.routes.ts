import { Route } from '@angular/router';

import { JhhClientDashboardShellComponent } from './containers/shell/jhh-client-dashboard-shell.component';

import { AuthPublicFacade, authPublicGuard } from '@jhh/jhh-client/auth/public';
import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardNotesShellRoutes } from '@jhh/jhh-client/dashboard/notes/shell';

export const JhhClientDashboardShellRoutes: Route = {
  path: ClientRoute.Home,
  component: JhhClientDashboardShellComponent,
  providers: [AuthFeatureFacade, AuthPublicFacade],
  canActivate: [authPublicGuard],
  children: [JhhClientDashboardNotesShellRoutes],
};
