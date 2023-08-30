import { Route } from '@angular/router';
import { JhhClientAuthShellComponent } from './jhh-client-auth-shell/jhh-client-auth-shell.component';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  AUTH_FEATURE_KEY,
  AuthEffects,
  authReducer,
} from '@jhh/jhh-client/auth/data-access';

export const JhhClientAuthShellRoutes: Route[] = [
  {
    path: '',
    component: JhhClientAuthShellComponent,
    providers: [
      provideState(AUTH_FEATURE_KEY, authReducer),
      provideEffects(AuthEffects),
    ],
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
