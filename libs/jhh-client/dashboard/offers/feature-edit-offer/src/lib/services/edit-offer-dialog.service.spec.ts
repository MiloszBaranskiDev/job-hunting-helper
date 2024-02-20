import { TestBed } from '@angular/core/testing';

import { EditOfferDialogService } from './edit-offer-dialog.service';

describe('EditOfferDialogService', () => {
  let service: EditOfferDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditOfferDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
