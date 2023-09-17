import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

import { JhhClientAuthShellComponent } from './container/jhh-client-auth-shell.component';

import {
  AUTH_FEATURE_KEY,
  AuthEffects,
  authReducer,
} from '@jhh/jhh-client/auth/data-access';
import { AuthFeatureEffects } from '@jhh/jhh-client/auth/feature';

import { authGuard } from './guard/auth.guard';

export const JhhClientAuthShellRoutes: Route = {
  path: '',
  component: JhhClientAuthShellComponent,
  providers: [
    provideState(AUTH_FEATURE_KEY, authReducer),
    provideEffects(AuthEffects, AuthFeatureEffects),
  ],
  canActivate: [authGuard],
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
};
