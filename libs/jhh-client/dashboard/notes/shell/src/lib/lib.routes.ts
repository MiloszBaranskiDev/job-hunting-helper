import { Route } from '@angular/router';

import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

export const JhhClientDashboardNotesShellRoutes: Route = {
  path: ClientRoutes.Notes,
  loadComponent: () =>
    import('@jhh/jhh-client/dashboard/notes/notes-groups').then(
      (c) => c.JhhClientDashboardNotesGroupsComponent
    ),
};
