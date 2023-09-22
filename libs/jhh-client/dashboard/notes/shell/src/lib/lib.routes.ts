import { Route } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardNotesShellComponent } from './containers/shell/jhh-client-dashboard-notes-shell.component';

export const JhhClientDashboardNotesShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardNotesShellComponent,
  children: [
    {
      path: ClientRoute.Notes,
      loadComponent: () =>
        import('@jhh/jhh-client/dashboard/notes/notes-groups').then(
          (c) => c.JhhClientDashboardNotesGroupsComponent
        ),
    },
  ],
};
