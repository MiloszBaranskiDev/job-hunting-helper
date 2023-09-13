import '@angular/compiler';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import * as AuthActions from '@jhh/jhh-client/auth/data-access';
import { AuthFeatureEffects } from './auth-feature.effects';

import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

const inject = require('@angular/core').inject;

describe('AuthFeatureEffects', () => {
  let actions$: Subject<any>;
  let routerMock: jest.Mocked<Router>;
  let effects: AuthFeatureEffects;

  beforeEach(() => {
    actions$ = new Subject();
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    inject.mockImplementation((token: any) => {
      if (token === Actions) {
        return actions$;
      } else if (token === Router) {
        return routerMock;
      }
      return null;
    });

    effects = new AuthFeatureEffects();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate home after login success', () => {
    effects.loginSuccess$.subscribe();

    actions$.next(AuthActions.loginSuccess({ payload: null as any }));

    expect(routerMock.navigate).toHaveBeenCalledWith([ClientRoutes.HomeSlash]);
  });

  it('should navigate home after register success', () => {
    effects.registerSuccess$.subscribe();

    actions$.next(AuthActions.registerSuccess({ payload: null as any }));

    expect(routerMock.navigate).toHaveBeenCalledWith([ClientRoutes.HomeSlash]);
  });
});
