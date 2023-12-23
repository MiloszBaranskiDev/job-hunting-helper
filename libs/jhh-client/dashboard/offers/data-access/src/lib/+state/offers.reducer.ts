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
  // addBoardColumn: OperationState;
}

export const adapter: EntityAdapter<Offer> = createEntityAdapter<Offer>();

export const initialOffersState: OffersState = adapter.getInitialState({
  // addBoardColumn: {
  //   inProgress: false,
  //   error: null,
  //   success: false,
  // },
});

const reducer: ActionReducer<OffersState> = createReducer(
  initialOffersState,
  on(OffersActions.setOffers, (state, { offers }) =>
    adapter.setAll(offers, state)
  )
);

export function offersReducer(state: OffersState | undefined, action: Action) {
  return reducer(state, action);
}
