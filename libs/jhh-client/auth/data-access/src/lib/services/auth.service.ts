import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  GetUserSuccessPayload,
  GetUserSuccessResponse,
  LoginPayload,
  LoginSuccessPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessPayload,
  RegisterSuccessResponse,
} from '@jhh/jhh-client/auth/interfaces';
import { ApiRoutes } from '@jhh/shared/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOCALSTORAGE_KEY: string = 'token';
  private readonly http: HttpClient = inject(HttpClient);

  login(payload: LoginPayload): Observable<LoginSuccessPayload> {
    return this.http
      .post<LoginSuccessResponse>(ApiRoutes.SignIn, {
        username: payload.username,
        password: payload.password,
      })
      .pipe(map((res: LoginSuccessResponse) => res.data));
  }

  register(payload: RegisterPayload): Observable<RegisterSuccessPayload> {
    return this.http
      .post<RegisterSuccessResponse>(ApiRoutes.CreateNewUser, {
        username: payload.username,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      })
      .pipe(map((res: RegisterSuccessResponse) => res.data));
  }

  getUser(): Observable<GetUserSuccessPayload> {
    return this.http
      .get<GetUserSuccessResponse>(ApiRoutes.GetUser)
      .pipe(map((res: GetUserSuccessResponse) => ({ data: res.data })));
  }

  saveToken(token: string): void {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(token));
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem(this.LOCALSTORAGE_KEY) as string);
  }

  removeToken() {
    localStorage.removeItem(this.LOCALSTORAGE_KEY);
  }
}
