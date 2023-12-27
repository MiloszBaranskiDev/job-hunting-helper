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

export const selectAddOfferInProgress = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.inProgress
);

export const selectAddOfferError = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.error
);

export const selectAddOfferSuccess = createSelector(
  selectOffersState,
  (state: OffersState) => state.addOffer.success!
);

export const selectRemoveOfferInProgress = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffer.inProgress
);

export const selectRemoveOfferError = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffer.error
);

export const selectRemoveOfferSuccess = createSelector(
  selectOffersState,
  (state: OffersState) => state.removeOffer.success!
);
