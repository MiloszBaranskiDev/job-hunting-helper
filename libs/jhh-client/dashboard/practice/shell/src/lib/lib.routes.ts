import { Route } from '@angular/router';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardPracticeShellComponent } from './containers/shell/jhh-client-dashboard-practice-shell.component';

export const JhhClientDashboardPracticeShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardPracticeShellComponent,
  // providers: [
  //   provideState(SCHEDULE_STATE_KEY, scheduleReducer),
  //   provideEffects(ScheduleEffects),
  // ],
  children: [
    {
      path: ClientRoute.Practice,
      title: 'Practice',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/practice/feature').then(
              (c) => c.JhhClientDashboardPracticeComponent
            ),
        },
      ],
    },
  ],
};
