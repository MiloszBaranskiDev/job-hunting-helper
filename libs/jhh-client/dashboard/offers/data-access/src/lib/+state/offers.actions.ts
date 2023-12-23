import { createAction, props } from '@ngrx/store';

import { Offer } from '@jhh/shared/interfaces';

export enum Type {
  SetOffers = '[Offers] Set Offers',
}

export const setOffers = createAction(
  Type.SetOffers,
  props<{ offers: Offer[] }>()
);
