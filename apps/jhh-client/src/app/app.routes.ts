import { Route } from '@angular/router';

import { JhhClientAuthShellRoutes } from '@jhh/jhh-client/auth/shell';
import { JhhClientDashboardShellRoutes } from '@jhh/jhh-client/dashboard/shell';

import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

export const appRoutes: Route[] = [
  { path: '', redirectTo: ClientRoutes.HomeSlash, pathMatch: 'full' },
  JhhClientAuthShellRoutes,
  JhhClientDashboardShellRoutes,
];
