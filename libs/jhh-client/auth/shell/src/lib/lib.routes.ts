import { Route } from '@angular/router';
import { JhhClientAuthShellComponent } from './jhh-client-auth-shell/jhh-client-auth-shell.component';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

export const JhhClientAuthShellRoutes: Route[] = [
  {
    path: '',
    component: JhhClientAuthShellComponent,
    children: [
      {
        path: ClientRoutes.Register,
        loadComponent: () =>
          import('@jhh/jhh-client/auth/register-feature').then(
            (c) => c.JhhClientAuthRegisterFeatureComponent
          ),
      },
      {
        path: ClientRoutes.Login,
        loadComponent: () =>
          import('@jhh/jhh-client/auth/login-feature').then(
            (c) => c.JhhClientAuthLoginFeatureComponent
          ),
      },
    ],
  },
];
