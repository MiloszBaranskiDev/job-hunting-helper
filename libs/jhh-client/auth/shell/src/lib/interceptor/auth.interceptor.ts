import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, filter } from 'rxjs';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { inject } from '@angular/core';
import { ApiRoutes } from '@jhh/shared/enums';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (
    req.url.endsWith(ApiRoutes.Login) ||
    req.url.endsWith(ApiRoutes.Register)
  ) {
    return next(req);
  }

  let token: string | null;
  const authFacade: AuthFacade = inject(AuthFacade);

  authFacade.token$
    .pipe(filter((tkn: string | null): tkn is string => !!tkn))
    .subscribe((tkn: string) => {
      token = tkn;
    });

  const modifiedReq: HttpRequest<any> = token!
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authFacade.logout();
      }
      throw error;
    })
  );
};
