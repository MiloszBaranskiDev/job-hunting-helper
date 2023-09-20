import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientAuthShellComponent } from './containers/shell/jhh-client-auth-shell.component';

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
      path: ClientRoute.Register,
      loadComponent: () =>
        import('@jhh/jhh-client/auth/feature-register').then(
          (c) => c.JhhClientAuthFeatureRegisterComponent
        ),
    },
    {
      path: ClientRoute.Login,
      loadComponent: () =>
        import('@jhh/jhh-client/auth/feature-login').then(
          (c) => c.JhhClientAuthFeatureLoginComponent
        ),
    },
  ],
};
