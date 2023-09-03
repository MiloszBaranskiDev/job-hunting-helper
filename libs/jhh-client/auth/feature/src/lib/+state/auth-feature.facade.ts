import { inject, Injectable } from '@angular/core';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';
import { Router } from '@angular/router';

@Injectable()
export class AuthFeatureFacade {
  private readonly router: Router = inject(Router);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  loginOrRedirect() {
    const token: string = this.authFacade.getToken();
    if (token) {
      this.authFacade.saveToken(token);
    } else {
      this.router.navigate([ClientRoutes.LoginSlash]);
    }
  }
}
