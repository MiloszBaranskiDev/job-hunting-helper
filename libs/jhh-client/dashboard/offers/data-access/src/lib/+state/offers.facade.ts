import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Offer } from '@jhh/shared/interfaces';

import * as OffersSelectors from './offers.selectors';

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
}
