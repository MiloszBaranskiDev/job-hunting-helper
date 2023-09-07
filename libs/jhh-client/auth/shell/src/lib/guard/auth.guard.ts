import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const router: Router = inject(Router);
  const authFacade: AuthFacade = inject(AuthFacade);

  const token: string = authFacade.getToken();

  if (token) {
    router.navigate([ClientRoutes.HomeSlash]);
    return false;
  } else {
    return true;
  }
};
