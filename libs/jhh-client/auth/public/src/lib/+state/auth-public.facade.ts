import { inject, Injectable } from '@angular/core';

import { AuthFeatureFacade } from '@jhh/jhh-client/auth/feature';

@Injectable()
export class AuthPublicFacade {
  private readonly authFeatureFacade: AuthFeatureFacade =
    inject(AuthFeatureFacade);

  loginOrRedirect(): void {
    this.authFeatureFacade.loginOrRedirect();
  }
}
