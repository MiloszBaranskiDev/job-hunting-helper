import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Offer } from '@jhh/shared/interfaces';

import {
  AddOfferPayload,
  AddOfferSuccessPayload,
  RemoveOfferPayload,
  RemoveOfferSuccessPayload,
} from '@jhh/jhh-client/dashboard/offers/domain';

export enum Type {
  SetOffers = '[Offers] Set Offers',
  AddOffer = '[Offers] Add Offer',
  AddOfferFail = '[Offers] Add Offer Fail',
  AddOfferSuccess = '[Offers] Add Offer Success',
  ResetAddOfferSuccess = '[Offers] Reset Add Offer Success',
  RemoveOffer = '[Offers] Remove Offer',
  RemoveOfferFail = '[Offers] Remove Offer Fail',
  RemoveOfferSuccess = '[Offers] Remove Offer Success',
  ResetRemoveOfferSuccess = '[Offers] Reset Remove Offer Success',
}

export const setOffers = createAction(
  Type.SetOffers,
  props<{ offers: Offer[] }>()
);

export const addOffer = createAction(
  Type.AddOffer,
  props<{ payload: AddOfferPayload }>()
);

export const addOfferFail = createAction(
  Type.AddOfferFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addOfferSuccess = createAction(
  Type.AddOfferSuccess,
  props<{ payload: AddOfferSuccessPayload }>()
);

export const resetAddOfferSuccess = createAction(Type.ResetAddOfferSuccess);

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
