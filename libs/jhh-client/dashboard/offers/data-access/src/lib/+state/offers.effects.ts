import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, tap } from 'rxjs/operators';

import * as OffersActions from './offers.actions';
import { OffersService } from '../services/offers/offers.service';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import {
  AddOfferSuccessPayload,
  RemoveOfferSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Injectable()
export class OffersEffects {
  private readonly actions$ = inject(Actions);
  private readonly offersService: OffersService = inject(OffersService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  addOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.addOffer),
      fetch({
        run: (action) =>
          this.offersService.addOffer(action.payload).pipe(
            mergeMap((res: AddOfferSuccessPayload) => [
              OffersActions.addOfferSuccess({ payload: res }),
              OffersActions.resetAddOfferSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Offer added successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.addOfferFail({ payload: error }),
      })
    )
  );

  removeOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.removeOffer),
      fetch({
        run: (action) =>
          this.offersService.removeOffer(action.payload).pipe(
            mergeMap((res: RemoveOfferSuccessPayload) => [
              OffersActions.removeOfferSuccess({ payload: res }),
              OffersActions.resetRemoveOfferSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Offer removed successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.removeOfferFail({ payload: error }),
      })
    )
  );
}
