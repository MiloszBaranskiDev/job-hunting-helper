import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardOffersShellComponent } from './containers/shell/jhh-client-dashboard-offers-shell.component';

import {
  OFFERS_STATE_KEY,
  offersReducer,
} from '@jhh/jhh-client/dashboard/offers/data-access';

export const JhhClientDashboardOffersShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardOffersShellComponent,
  providers: [
    provideState(OFFERS_STATE_KEY, offersReducer),
    // provideEffects(BoardEffects),
  ],
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
