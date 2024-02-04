import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Injectable()
export class AuthFeatureFacade {
  private readonly router: Router = inject(Router);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  loginOrRedirect(): void {
    const token: string = this.authFacade.getToken();

    if (token) {
      this.authFacade.saveToken(token);
    } else {
      this.router.navigate([ClientRoute.LoginLink]);
    }
  }
}
