import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

import { User } from '@jhh/shared/interfaces';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  token: string | null;
  loginInProgress: boolean;
  loginError: string | null;
  registerInProgress: boolean;
  registerError: string | null;
  user: User | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialAuthState: AuthState = {
  token: null,
  loginInProgress: false,
  loginError: null,
  registerInProgress: false,
  registerError: null,
  user: null,
};

const reducer: ActionReducer<AuthState> = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loginInProgress: true,
  })),
  on(AuthActions.loginFail, (state, { payload }) => ({
    ...state,
    loginInProgress: false,
    loginError: payload.error.message,
  })),
  on(AuthActions.loginSuccess, (state, { payload }) => ({
    ...state,
    loginInProgress: false,
    token: payload.token,
    user: payload.user,
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    registerInProgress: true,
  })),
  on(AuthActions.registerFail, (state, { payload }) => ({
    ...state,
    registerInProgress: false,
    registerError: payload.error.message,
  })),
  on(AuthActions.registerSuccess, (state, { payload }) => ({
    ...state,
    registerInProgress: false,
    token: payload.token,
    user: payload.user,
  })),
  on(AuthActions.saveToken, (state, { payload }) => ({
    ...state,
    loginInProgress: false,
    token: payload.token,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    user: null,
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
