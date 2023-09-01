import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as AuthActions from '@jhh/jhh-client/auth/data-access';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

@Injectable()
export class AuthFeatureEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly router: Router = inject(Router);

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate([ClientRoutes.HomeSlash]);
        })
      ),
    { dispatch: false }
  );
}
