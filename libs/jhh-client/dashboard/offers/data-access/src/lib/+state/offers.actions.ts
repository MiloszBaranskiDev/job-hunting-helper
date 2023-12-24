import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Offer } from '@jhh/shared/interfaces';

import {
  RemoveOfferPayload,
  RemoveOfferSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

export enum Type {
  SetOffers = '[Offers] Set Offers',
  RemoveOffer = '[Offers] Remove Offer',
  RemoveOfferFail = '[Offers] Remove Offer Fail',
  RemoveOfferSuccess = '[Offers] Remove Offer Success',
  ResetRemoveOfferSuccess = '[Offers] Reset Remove Offer Success',
}

export const setOffers = createAction(
  Type.SetOffers,
  props<{ offers: Offer[] }>()
);

export const removeOffer = createAction(
  Type.RemoveOffer,
  props<{ payload: RemoveOfferPayload }>()
);

export const removeOfferFail = createAction(
  Type.RemoveOfferFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeOfferSuccess = createAction(
  Type.RemoveOfferSuccess,
  props<{ payload: RemoveOfferSuccessPayload }>()
);

export const resetRemoveOfferSuccess = createAction(
  Type.ResetRemoveOfferSuccess
);
