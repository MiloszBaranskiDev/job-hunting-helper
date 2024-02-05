import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@jhh/jhh-client/shared/config';

import {
  LoginPayload,
  LoginSuccessPayload,
  LoginSuccessResponse,
  RegisterPayload,
  RegisterSuccessPayload,
  RegisterSuccessResponse,
  RemoveAccountSuccessResponse,
} from '@jhh/jhh-client/auth/domain';
import { ApiRoute } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { RemoveAccountSuccessPayload } from 'libs/jhh-client/auth/domain/src/lib/interfaces/payloads/remove-account-success-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);

  readonly LOCALSTORAGE_KEY: string = 'token';
  private readonly API_USER_URL: string =
    environment.apiUrl + ApiRoute.BaseUser;

  login(payload: LoginPayload): Observable<LoginSuccessPayload> {
    return this.http
      .post<LoginSuccessResponse>(this.API_USER_URL + ApiRoute.Login, {
        username: payload.username,
        password: payload.password,
      })
      .pipe(map((res: LoginSuccessResponse) => res.data));
  }

  register(payload: RegisterPayload): Observable<RegisterSuccessPayload> {
    return this.http
      .post<RegisterSuccessResponse>(this.API_USER_URL + ApiRoute.Register, {
        username: payload.username,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      })
      .pipe(map((res: RegisterSuccessResponse) => res.data));
  }

  removeAccount(): Observable<RemoveAccountSuccessPayload> {
    return this.http
      .delete<RemoveAccountSuccessResponse>(
        this.API_USER_URL + ApiRoute.RemoveAccount
      )
      .pipe(map((res: RemoveAccountSuccessResponse) => res.data));
  }

  saveToken(token: string): void {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(token));
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem(this.LOCALSTORAGE_KEY) as string);
  }

  removeToken(): void {
    localStorage.removeItem(this.LOCALSTORAGE_KEY);
    this.router.navigate([ClientRoute.LoginLink]);
  }
}
