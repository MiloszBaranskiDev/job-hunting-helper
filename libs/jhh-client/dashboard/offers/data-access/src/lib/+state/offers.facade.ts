import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Offer } from '@jhh/shared/interfaces';

import * as OffersSelectors from './offers.selectors';
import * as OffersActions from './offers.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class OffersFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  offers$: Observable<Offer[]> = this.store.pipe(
    select(OffersSelectors.selectOffers)
  );

  removeOfferInProgress$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectRemoveOfferInProgress)
  );

  removeOfferError$: Observable<string | null> = this.store.pipe(
    select(OffersSelectors.selectRemoveOfferError)
  );

  removeOfferSuccess$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectRemoveOfferSuccess)
  );

  removeOffer(offerId: string) {
    return this.actionResolverService.executeAndWatch(
      OffersActions.removeOffer({
        payload: { offerId: offerId },
      }),
      OffersActions.Type.RemoveOfferSuccess,
      OffersActions.Type.RemoveOfferFail
    );
  }
}
