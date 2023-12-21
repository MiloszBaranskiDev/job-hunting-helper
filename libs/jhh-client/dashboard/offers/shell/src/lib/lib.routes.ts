import { Route } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardOffersShellComponent } from './containers/shell/jhh-client-dashboard-offers-shell.component';

export const JhhClientDashboardOffersShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardOffersShellComponent,
  // providers: [
  //   provideState(BOARD_STATE_KEY, boardReducer),
  //   provideEffects(BoardEffects),
  // ],
  children: [
    {
      path: ClientRoute.Offers,
      title: 'Offers',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/offers/feature').then(
              (c) => c.JhhClientDashboardOffersComponent
            ),
        },
      ],
    },
  ],
};
