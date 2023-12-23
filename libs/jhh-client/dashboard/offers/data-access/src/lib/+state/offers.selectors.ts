import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, OFFERS_STATE_KEY, OffersState } from './offers.reducer';

import { Offer } from '@jhh/shared/interfaces';

export const selectOffersState =
  createFeatureSelector<OffersState>(OFFERS_STATE_KEY);

export const {
  selectIds: selectOffersIds,
  selectEntities: selectColumnEntities,
  selectAll: selectAllOffers,
  selectTotal: selectTotalOffers,
} = adapter.getSelectors(selectOffersState);

export const selectOffers = createSelector(
  selectAllOffers,
  (offers: Offer[]) => offers
);
