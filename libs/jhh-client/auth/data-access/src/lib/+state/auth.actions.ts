import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import {
  LoginPayload,
  LoginSuccessPayload,
  RegisterPayload,
  RegisterSuccessPayload,
  SaveTokenPayload,
} from '@jhh/jhh-client/auth/interfaces';

export enum Type {
  Login = '[Auth] Login',
  LoginFail = '[Auth] Login Fail',
  LoginSuccess = '[Auth] Login Success',
  Register = '[Auth] Register',
  RegisterFail = '[Auth] Register Fail',
  RegisterSuccess = '[Auth] Register Success',
  SaveToken = '[Auth] Save Token',
  Logout = '[Auth] Logout',
}

export const login = createAction(
  Type.Login,
  props<{ payload: LoginPayload }>()
);

export const loginFail = createAction(
  Type.LoginFail,
  props<{ payload: HttpErrorResponse }>()
);

export const loginSuccess = createAction(
  Type.LoginSuccess,
  props<{ payload: LoginSuccessPayload }>()
);

export const register = createAction(
  Type.Register,
  props<{ payload: RegisterPayload }>()
);

export const registerFail = createAction(
  Type.RegisterFail,
  props<{ payload: HttpErrorResponse }>()
);

export const registerSuccess = createAction(
  Type.RegisterSuccess,
  props<{ payload: RegisterSuccessPayload }>()
);

export const saveToken = createAction(
  Type.SaveToken,
  props<{ payload: SaveTokenPayload }>()
);

export const logout = createAction(Type.Logout);
