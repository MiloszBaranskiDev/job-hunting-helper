import { TestBed } from '@angular/core/testing';

import { RemoveOfferDialogService } from './remove-offer-dialog.service';

describe('RemoveOfferDialogService', () => {
  let service: RemoveOfferDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveOfferDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
