import { TestBed } from '@angular/core/testing';

import { RemoveOffersDialogService } from 'libs/jhh-client/dashboard/offers/feature-remove-offer/src/lib/service/remove-offers-dialog.service';

describe('RemoveOfferDialogService', () => {
  let service: RemoveOffersDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveOffersDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
