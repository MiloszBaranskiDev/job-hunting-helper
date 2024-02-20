import { TestBed } from '@angular/core/testing';

import { RemoveOffersDialogService } from '../services/remove-offers-dialog.service';

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
