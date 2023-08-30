import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '@jhh/shared/interfaces';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  token: string | null;
  registerInProgress: boolean;
  loginInProgress: boolean;
  getUserInProgress: boolean;
  user: User | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialAuthState: AuthState = {
  token: null,
  registerInProgress: false,
  loginInProgress: false,
  getUserInProgress: false,
  user: null,
};

const reducer: ActionReducer<AuthState> = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loginInProgress: true,
  })),
  on(AuthActions.loginFail, (state) => ({
    ...state,
    loginInProgress: false,
  })),
  on(AuthActions.loginSuccess, (state, { payload }) => ({
    ...state,
    loginInProgress: false,
    token: payload.token,
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    registerInProgress: true,
  })),
  on(AuthActions.registerFail, (state) => ({
    ...state,
    registerInProgress: false,
  })),
  on(AuthActions.registerSuccess, (state, { payload }) => ({
    ...state,
    registerInProgress: false,
    token: payload.token,
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
  })),
  on(AuthActions.getUser, (state) => ({
    ...state,
    getUserInProgress: true,
  })),
  on(AuthActions.getUserFail, (state) => ({
    ...state,
    getUserInProgress: false,
  })),
  on(AuthActions.getUserSuccess, (state, { payload }) => ({
    ...state,
    getUserInProgress: false,
    user: payload.data,
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
