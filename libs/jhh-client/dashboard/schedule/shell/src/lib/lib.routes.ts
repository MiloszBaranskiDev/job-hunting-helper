import { Route } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardScheduleShellComponent } from './containers/shell/jhh-client-dashboard-schedule-shell.component';

export const JhhClientDashboardScheduleShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardScheduleShellComponent,
  // providers: [
  //   provideState(OFFERS_STATE_KEY, offersReducer),
  //   provideEffects(OffersEffects),
  // ],
  children: [
    {
      path: ClientRoute.Schedule,
      title: 'Schedule',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/schedule/feature').then(
              (c) => c.JhhClientDashboardScheduleComponent
            ),
        },
      ],
    },
  ],
};
