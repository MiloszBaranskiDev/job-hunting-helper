import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActionCreator } from '@ngrx/store';
import * as AuthActions from '@jhh/jhh-client/auth/data-access';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

@Injectable()
export class AuthFeatureEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly router: Router = inject(Router);

  navigateHome = () => this.router.navigate([ClientRoutes.HomeSlash]);

  createNavigationEffect = (action: ActionCreator) =>
    createEffect(
      () => this.actions$.pipe(ofType(action), tap(this.navigateHome)),
      { dispatch: false }
    );

  loginSuccess$ = this.createNavigationEffect(AuthActions.loginSuccess);
  registerSuccess$ = this.createNavigationEffect(AuthActions.registerSuccess);
}
