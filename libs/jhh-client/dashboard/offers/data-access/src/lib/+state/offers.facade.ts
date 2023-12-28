import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Offer } from '@jhh/shared/interfaces';

import * as OffersSelectors from './offers.selectors';
import * as OffersActions from './offers.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/enums';

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

  addOfferInProgress$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectAddOfferInProgress)
  );

  addOfferError$: Observable<string | null> = this.store.pipe(
    select(OffersSelectors.selectAddOfferError)
  );

  addOfferSuccess$: Observable<boolean> = this.store.pipe(
    select(OffersSelectors.selectAddOfferSuccess)
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

  addOffer(
    position: string,
    link: string,
    company: string,
    companyType: OfferCompanyType,
    location: OfferLocation,
    status: OfferStatus,
    priority: OfferPriority,
    minSalary: number | undefined,
    maxSalary: number | undefined,
    salaryCurrency: OfferSalaryCurrency | undefined,
    email: string | undefined,
    description: string | undefined
  ) {
    return this.actionResolverService.executeAndWatch(
      OffersActions.addOffer({
        payload: {
          position,
          link,
          company,
          companyType,
          location,
          status,
          priority,
          minSalary,
          maxSalary,
          salaryCurrency,
          email,
          description,
        },
      }),
      OffersActions.Type.RemoveOfferSuccess,
      OffersActions.Type.RemoveOfferFail
    );
  }

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
