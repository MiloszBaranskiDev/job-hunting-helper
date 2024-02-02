import { Route } from '@angular/router';

import { JhhClientAuthShellRoutes } from '@jhh/jhh-client/auth/shell';
import { JhhClientDashboardShellRoutes } from '@jhh/jhh-client/dashboard/shell';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

export const appRoutes: Route[] = [
  { path: '', redirectTo: ClientRoute.HomeLink, pathMatch: 'full' },
  JhhClientAuthShellRoutes,
  JhhClientDashboardShellRoutes,
];
