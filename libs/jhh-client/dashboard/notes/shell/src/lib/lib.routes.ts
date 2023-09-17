import { Route } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

export const JhhClientDashboardNotesShellRoutes: Route = {
  path: ClientRoute.Notes,
  loadComponent: () =>
    import('@jhh/jhh-client/dashboard/notes/notes-groups').then(
      (c) => c.JhhClientDashboardNotesGroupsComponent
    ),
};
