import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

@Injectable()
export class PracticeEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
}
