import { TestBed } from '@angular/core/testing';

import { RemoveNotesGroupModalService } from './remove-notes-group-modal.service';

describe('RemoveNotesGroupModalService', () => {
  let service: RemoveNotesGroupModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveNotesGroupModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
