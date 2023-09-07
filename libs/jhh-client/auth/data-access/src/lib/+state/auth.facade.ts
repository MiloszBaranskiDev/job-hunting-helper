import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth/auth.service';

import { ActionResolverService } from '@jhh/jhh-client/shared/utils-ngrx';

@Injectable()
export class AuthFacade {
  private readonly store: Store = inject(Store);
  private readonly authService: AuthService = inject(AuthService);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  token$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthToken)
  );

  loginInProgress$: Observable<boolean> = this.store.pipe(
    select(AuthSelectors.selectAuthLoginInProgress)
  );

  loginError$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthLoginError)
  );

  registerInProgress$: Observable<boolean> = this.store.pipe(
    select(AuthSelectors.selectAuthRegisterInProgress)
  );

  registerError$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthRegisterError)
  );

  login(username: string, password: string) {
    return this.actionResolverService.executeAndWatch(
      AuthActions.login({
        payload: { username: username, password: password },
      }),
      AuthActions.Type.LoginSuccess,
      AuthActions.Type.LoginFail
    );
  }

  register(username: string, password: string, confirmPassword: string) {
    return this.actionResolverService.executeAndWatch(
      AuthActions.register({
        payload: {
          username: username,
          password: password,
          confirmPassword: confirmPassword,
        },
      }),
      AuthActions.Type.RegisterSuccess,
      AuthActions.Type.RegisterFail
    );
  }

  saveToken(token: string): void {
    this.store.dispatch(AuthActions.saveToken({ payload: { token: token } }));
  }

  getToken(): string {
    return this.authService.getToken();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
