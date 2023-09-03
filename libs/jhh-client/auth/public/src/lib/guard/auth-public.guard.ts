import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { AuthPublicFacade } from '../+state/auth-public.facade';

export const authPublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authFacade: AuthFacade = inject(AuthFacade);
  const authPublicFacade: AuthPublicFacade = inject(AuthPublicFacade);

  return authFacade.token$.pipe(
    tap((token: string | null) => {
      if (!token) {
        authPublicFacade.loginOrRedirect();
      }
    }),
    // first((token: string) => !!token),
    // switchMap(() => this.authPublicFacade.user$),
    // tap((user: User) => {
    //   if (!user) {
    //     this.authPublicFacade.getUser();
    //   }
    // }),
    // first((user: User) => !!user),
    map(() => true)
  );
};
