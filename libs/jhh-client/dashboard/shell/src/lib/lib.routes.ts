import { Route } from '@angular/router';
import { JhhClientDashboardShellComponent } from './container/jhh-client-dashboard-shell.component';
import { AuthPublicFacade, authPublicGuard } from '@jhh/jhh-client/auth/public';
import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

export const JhhClientDashboardShellRoutes: Route = {
  path: 'home',
  component: JhhClientDashboardShellComponent,
  providers: [AuthFeatureFacade, AuthPublicFacade],
  canActivate: [authPublicGuard],
  // children: [
  //   {
  //     path: ClientRoutes.Register,
  //     loadComponent: () =>
  //       import('@jhh/jhh-client/auth/register-feature').then(
  //         (c) => c.JhhClientAuthRegisterFeatureComponent
  //       ),
  //   },
  // ],
};
