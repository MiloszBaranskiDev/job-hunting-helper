import { Route } from '@angular/router';
import { JhhClientAuthShellComponent } from './jhh-client-auth-shell/jhh-client-auth-shell.component';

export const JhhClientAuthShellRoutes: Route[] = [
  {
    path: '',
    component: JhhClientAuthShellComponent,
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('@jhh/jhh-client/auth/register-feature').then(
            (c) => c.JhhClientAuthRegisterFeatureComponent
          ),
      },
    ],
  },
];
