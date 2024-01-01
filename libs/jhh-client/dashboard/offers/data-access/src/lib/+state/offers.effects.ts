import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, tap } from 'rxjs/operators';

import * as OffersActions from './offers.actions';
import { OffersService } from '../services/offers/offers.service';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { EditOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';
import { RemoveOfferDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offer';

import {
  AddOfferSuccessPayload,
  EditOfferSuccessPayload,
  RemoveOfferSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

@Injectable()
export class OffersEffects {
  private readonly actions$ = inject(Actions);
  private readonly offersService: OffersService = inject(OffersService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );
  private readonly removeOfferDialogService: RemoveOfferDialogService = inject(
    RemoveOfferDialogService
  );

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

  editOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.editOffer),
      fetch({
        run: (action) =>
          this.offersService.editOffer(action.payload).pipe(
            mergeMap((res: EditOfferSuccessPayload) => [
              OffersActions.editOfferSuccess({ payload: res }),
              OffersActions.resetEditOfferSuccess(),
            ]),
            tap(() => {
              this.editOfferDialogService.clearOfferToEdit();
              this.snackbarService.open('Offer edited successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.editOfferFail({ payload: error }),
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
              this.removeOfferDialogService.clearOfferToRemove();
              this.snackbarService.open('Offer removed successfully!');
            })
          ),
        onError: (action, error) =>
          OffersActions.removeOfferFail({ payload: error }),
      })
    )
  );
}
