import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as OffersActions from './offers.actions';

import { Offer } from '@jhh/shared/interfaces';

export const OFFERS_STATE_KEY = 'offers';

export interface OperationState {
  inProgress: boolean;
  error: string | null;
  success?: boolean;
}

export interface OffersState extends EntityState<Offer> {
  addOffer: OperationState;
  removeOffer: OperationState;
}

export const adapter: EntityAdapter<Offer> = createEntityAdapter<Offer>();

export const initialOffersState: OffersState = adapter.getInitialState({
  addOffer: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeOffer: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<OffersState> = createReducer(
  initialOffersState,
  on(OffersActions.setOffers, (state, { offers }) =>
    adapter.setAll(offers, state)
  ),
  on(OffersActions.addOffer, (state) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(OffersActions.addOfferFail, (state, { payload }) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(OffersActions.addOfferSuccess, (state, { payload }) => {
    return adapter.addOne(payload.addedOffer, {
      ...state,
      addOffer: {
        ...state.addOffer,
        inProgress: false,
        success: true,
        error: null,
      },
    });
  }),
  on(OffersActions.resetAddOfferSuccess, (state) => ({
    ...state,
    addOffer: {
      ...state.addOffer,
      success: false,
    },
  })),
  on(OffersActions.removeOffer, (state) => ({
    ...state,
    removeOffer: {
      ...state.removeOffer,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(OffersActions.removeOfferFail, (state, { payload }) => ({
    ...state,
    removeOffer: {
      ...state.removeOffer,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(OffersActions.removeOfferSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.removedOffer.id, {
      ...state,
      removeOffer: {
        ...state.removeOffer,
        inProgress: false,
        success: true,
      },
    });
  }),
  on(OffersActions.resetRemoveOfferSuccess, (state) => ({
    ...state,
    removeOffer: {
      ...state.removeOffer,
      success: false,
    },
  }))
);

export function offersReducer(state: OffersState | undefined, action: Action) {
  return reducer(state, action);
}
