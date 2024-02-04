import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';

import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

import {
  LoginSuccessPayload,
  RegisterSuccessPayload,
} from '@jhh/jhh-client/auth/domain';

@Injectable()
export class AuthEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly authService: AuthService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      fetch({
        run: (action) =>
          this.authService.login(action.payload).pipe(
            tap((res: LoginSuccessPayload) =>
              this.authService.saveToken(res.token)
            ),
            map((res: LoginSuccessPayload) =>
              AuthActions.loginSuccess({ payload: res })
            )
          ),
        onError: (action, error) => AuthActions.loginFail({ payload: error }),
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      fetch({
        run: (action) =>
          this.authService.register(action.payload).pipe(
            tap((res: RegisterSuccessPayload) =>
              this.authService.saveToken(res.token)
            ),
            map((res: RegisterSuccessPayload) =>
              AuthActions.registerSuccess({ payload: res })
            )
          ),
        onError: (action, error) =>
          AuthActions.registerFail({ payload: error }),
      })
    )
  );

  saveToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.saveToken),
      tap((val) => {
        this.authService.saveToken(val.payload.token);
      }),
      distinctUntilChanged()
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.removeToken();
      }),
      distinctUntilChanged()
    )
  );
}
