import '@angular/compiler';
import { TypedAction } from '@ngrx/store/src/models';
import { HttpErrorResponse } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { authReducer, AuthState, initialAuthState } from './auth.reducer';

import { User } from '@jhh/shared/domain';
import {
  LoginPayload,
  LoginSuccessPayload,
  RegisterPayload,
  RegisterSuccessPayload,
  SaveTokenPayload,
} from '@jhh/jhh-client/auth/domain';

const dummyUser: User = {
  id: '1337',
  createdAt: new Date(),
  username: 'username',
};

describe('Auth Reducer', () => {
  let initialState: AuthState;

  beforeEach(() => {
    initialState = {
      ...initialAuthState,
    };
  });

  describe('valid Auth actions', () => {
    it('should set loginInProgress to true on login', () => {
      const action: {
        payload: LoginPayload;
      } & TypedAction<AuthActions.Type.Login> = AuthActions.login({
        payload: { username: 'username', password: 'password' },
      });
      const result: AuthState = authReducer(initialState, action);
      expect(result.login.inProgress).toBe(true);
    });

    it('should set loginInProgress to false and set loginError on loginFail', () => {
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Login failed' },
        status: 401,
        statusText: 'Unauthorized',
      });
      const action: {
        payload: HttpErrorResponse;
      } & TypedAction<AuthActions.Type.LoginFail> = AuthActions.loginFail({
        payload: errorResponse,
      });
      const result: AuthState = authReducer(initialState, action);
      expect(result.login.inProgress).toBe(false);
      expect(result.login.error).toBe('Login failed');
    });

    it('should set loginInProgress to false and set token and user on loginSuccess', () => {
      const payload: LoginSuccessPayload = {
        token: 'some-token',
        user: dummyUser,
      };
      const action: {
        payload: LoginSuccessPayload;
      } & TypedAction<AuthActions.Type.LoginSuccess> = AuthActions.loginSuccess(
        { payload }
      );
      const result: AuthState = authReducer(initialState, action);
      expect(result.login.inProgress).toBe(false);
      expect(result.token).toBe('some-token');
      expect(result.user).toEqual(dummyUser);
    });

    it('should set registerInProgress to true on register', () => {
      const action: {
        payload: RegisterPayload;
      } & TypedAction<AuthActions.Type.Register> = AuthActions.register({
        payload: {
          username: 'username',
          password: 'password',
          confirmPassword: 'password',
        },
      });
      const result: AuthState = authReducer(initialState, action);
      expect(result.register.inProgress).toBe(true);
    });

    it('should set registerInProgress to false and set registerError on registerFail', () => {
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Register failed' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action: {
        payload: HttpErrorResponse;
      } & TypedAction<AuthActions.Type.RegisterFail> = AuthActions.registerFail(
        { payload: errorResponse }
      );
      const result: AuthState = authReducer(initialState, action);
      expect(result.register.inProgress).toBe(false);
      expect(result.register.error).toBe('Register failed');
    });

    it('should set registerInProgress to false and set token and user on registerSuccess', () => {
      const payload: RegisterSuccessPayload = {
        token: 'some-token',
        user: dummyUser,
      };
      const action: {
        payload: RegisterSuccessPayload;
      } & TypedAction<AuthActions.Type.RegisterSuccess> =
        AuthActions.registerSuccess({ payload });
      const result: AuthState = authReducer(initialState, action);
      expect(result.register.inProgress).toBe(false);
      expect(result.token).toBe('some-token');
      expect(result.user).toEqual(dummyUser);
    });

    it('should set token on saveToken', () => {
      const payload: { token: string } = { token: 'new-token' };
      const action: {
        payload: SaveTokenPayload;
      } & TypedAction<AuthActions.Type.SaveToken> = AuthActions.saveToken({
        payload,
      });
      const result: AuthState = authReducer(initialState, action);
      expect(result.token).toBe('new-token');
    });

    it('should reset token and user on logout', () => {
      const action: TypedAction<AuthActions.Type.Logout> = AuthActions.logout();
      const result: AuthState = authReducer(initialState, action);
      expect(result.token).toBe(null);
      expect(result.user).toBe(null);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result: AuthState = authReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });
});
