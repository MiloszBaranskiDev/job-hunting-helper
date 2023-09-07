import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

export const selectAuthState =
  createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthLoginInProgress = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginInProgress
);

export const selectAuthLoginError = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginError
);

export const selectAuthRegisterInProgress = createSelector(
  selectAuthState,
  (state: AuthState) => state.registerInProgress
);

export const selectAuthRegisterError = createSelector(
  selectAuthState,
  (state: AuthState) => state.registerError
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
